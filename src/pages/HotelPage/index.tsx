import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom'

const HotelPage = () => {
    const [searchParams] = useSearchParams();

    const slug = useMemo(() => {
        return searchParams.get('slug')
    }, [searchParams]);

    

  return (
    <div>HotelPage</div>
  )
}

export default HotelPage