/* eslint-disable react/prop-types */
import { format } from 'date-fns'
import { Link } from 'react-router-dom'

const JobCard = ({job}) => {
  const {_id,title,description,min_price,max_price,bid_count,category,deadline} = job
  // console.log(job)
  return (
    <Link
      to={`/job/${_id}`}
      className='w-full max-w-sm px-4 py-3 bg-white rounded-md shadow-md hover:scale-[1.05] transition-all'
    >
      <div className='flex items-center justify-between'>
        <span className='text-xs font-light text-gray-800 '>
          Deadline: {format(new Date(deadline), 'P')}
        </span>
        <span className='px-3 py-1 text-[8px] text-blue-800 uppercase bg-blue-200 rounded-full '>
          {category}
        </span>
      </div>

      <div>
        <h1 className='mt-2 text-lg font-semibold text-gray-800 '>
         {title}
        </h1>
        <h3>Category: {category}</h3>
        <p className='mt-2 text-sm text-gray-600 '>
         {description?.substr(0,27)}...
        </p>
        <p className='mt-2 text-sm font-bold text-gray-600 '>
          Range: ${max_price} - ${min_price}
        </p>
        <p className='mt-2 text-sm font-bold text-gray-600 '>Total Bids: {bid_count}</p>
      </div>
    </Link>
  )
}

export default JobCard
