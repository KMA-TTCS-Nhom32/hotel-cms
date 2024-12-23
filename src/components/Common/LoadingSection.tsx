import { Icons } from './Icons';

const LoadingSection = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-5'>
      <Icons.spinner className='w-10 h-10 animate-spin' />
      <div className='flex items-center space-x-2'>
        <div className='w-4 h-4 bg-primary rounded-full animate-bounce' />
        <div className='w-4 h-4 bg-primary rounded-full animate-bounce' />
        <div className='w-4 h-4 bg-primary rounded-full animate-bounce' />
      </div>
    </div>
  );
};

export default LoadingSection;
