import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { BreadcrumbLinkItem, useBreadcrumbStore } from '@/stores/breadcrumbs/useBreadcrumbStore';
import { useNavigate } from 'react-router-dom';

interface HeaderBreadCrumbsProps {
  links: BreadcrumbLinkItem[];
}

const HeaderBreadCrumbs = ({ links }: HeaderBreadCrumbsProps) => {
  const { onNavigate } = useBreadcrumbStore((state) => state);
  const navigate = useNavigate();

  return (
    <Breadcrumb>
      <BreadcrumbList className='body2 text-gray-400'>
        {links.map((link, index) => (
          <>
            <BreadcrumbItem key={index}>
              {index !== links.length - 1 && links.length > 1 ? (
                <button onClick={() => onNavigate(link.to, index, navigate)}>
                  <BreadcrumbLink>{link.label}</BreadcrumbLink>
                </button>
              ) : (
                <BreadcrumbLink className='cursor-text'>{link.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index !== links.length - 1 && <BreadcrumbSeparator />}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default HeaderBreadCrumbs;
