import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { Tag } from '@shopify/polaris'

import { CollectionProduct, ProviderProps } from 'types'

import logo from '../assets/logo.png'
import { FilterType } from 'constants/AdjustFilter'
import AdjustFilter from 'containers/AdjustFilter'
import CustomizeDisplay from 'containers/CustomizeDisplay'
import MasterTable from 'containers/MasterTable'
import SearchBar from 'containers/SearchBar'
import { masterTableActions } from 'store/MasterTableSlice'
import { useAppQuery } from '../hooks'

export default function HomePage() {
  const dispatch = useDispatch()
  const [productQueryVariable, setProductQueryVariable] = useState({
    first: 25,
    sortKey: 'TITLE',
    query: '',
  })
  const [tagList, setTagList] = useState<ProviderProps[]>([])
  const [removeTagList, setRemoveTagList] = useState<ProviderProps[]>([])

  const { isLoading } = useAppQuery({
    url: '/api/products',
    fetchInit: {
      method: 'POST',
      body: JSON.stringify({
        first: 10,
      }),
    },
    reactQueryOptions: {
      onSuccess: (res: any) => {
        console.log(res.data.products.nodes)
        dispatch(masterTableActions.setInitState(res.data.products.nodes))
      },
      onError: (error: any) => {
        console.log(error)
      },
    },
  })

  const { data, isLoading: loadingTags } = useAppQuery({
    url: '/api/products/tags',
    fetchInit: {
      method: 'POST',
      body: JSON.stringify({
        first: 10,
      }),
    },
    reactQueryOptions: {
      onSuccess: (res: any) => {
        dispatch(
          masterTableActions.setInitProductTags({
            productVendors: res.data?.shop?.productVendors?.edges?.map((x: any) => x.node),
            productTypes: res.data?.shop?.productTypes?.edges?.map((x: any) => x.node),
            collections: res.data?.collections?.nodes?.map(
              (x: any) =>
                ({ id: x?.id?.match(/\d+$/g)?.shift(), title: x?.title } as CollectionProduct)
            ),
          })
        )
      },
      onError: (error: any) => {
        console.log(error)
      },
    },
  })

  useEffect(() => {
    dispatch(masterTableActions.setIsLoading(isLoading && loadingTags))
  }, [isLoading, loadingTags, dispatch])

  const handleFilter = (query: string): void => {
    setProductQueryVariable({
      ...productQueryVariable,
      query: query,
    })
  }

  const handleRemoveTagFilter = (tag: string): void => {
    setRemoveTagList(tagList.filter(f => f[FilterType.LABEL] === tag))
    setTagList(prev => prev.filter(f => f[FilterType.LABEL] !== tag))
  }

  const handleSearch = (text: string): void => {
    setProductQueryVariable({
      ...productQueryVariable,
      query: text ? `title: '${text}'` : '',
    })
  }

  return (
    <>
      <button
        onClick={() =>
          // This button show you how we refetch the data.
          // Just update the query variable and the data will be refetched.
          setProductQueryVariable({
            ...productQueryVariable,
            query: "title: 'black'",
          })
        }>
        Test search with name = black
      </button>
      <div className='flex w-full gap-2'>
        {tagList?.map((value, index) => (
          <Tag key={index} onRemove={() => handleRemoveTagFilter(value[FilterType.LABEL])}>
            {value[FilterType.LABEL]}
          </Tag>
        ))}
      </div>

      <div className='flex flex-wrap'>
        <img src={logo} className='w-full h-full w-28' alt='logo-qep' />
        <SearchBar placeHolder='Search products' className='w-96' onSearch={handleSearch} />
        <CustomizeDisplay />
        <AdjustFilter
          removeTags={removeTagList}
          onFilter={handleFilter}
          onGetTagFilter={setTagList}
        />
      </div>
      <MasterTable />
    </>
  )
}
