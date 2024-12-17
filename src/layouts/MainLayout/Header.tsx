import { Text } from '@/components/ui/text';

import styles from './index.module.scss';
import { useUserStore } from '@/stores/user/userContext';

const Header = () => {
  const { user } = useUserStore((state) => state);

  return (
    <header className={styles.mainHeaderWrap}>
      <div className={'text-right'}>
        <Text type='title2-semi-bold' className='text-primary'>
          {user?.name}
        </Text>
        <Text type='body2' className='text-primary mb-0'>
          {user?.role}
        </Text>
      </div>
    </header>
  );
};

export default Header;
