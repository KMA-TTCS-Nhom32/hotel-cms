import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { BreadcrumbLinkItem } from '@/stores/breadcrumbs/useBreadcrumbStore';

interface HeaderBreadCrumbsProps {
  links: BreadcrumbLinkItem[];
}

const HeaderBreadCrumbs = ({ links }: HeaderBreadCrumbsProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {links.map((link, index) => (
          <>
            <BreadcrumbItem key={index}>
              {index === 0 ? (
                <h4 className='text-base text-gray-400'>{link.label}</h4>
              ) : (
                <BreadcrumbLink href={link.to}>{link.label}</BreadcrumbLink>
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
