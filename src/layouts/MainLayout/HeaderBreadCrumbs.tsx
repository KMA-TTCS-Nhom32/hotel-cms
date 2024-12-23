import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface HeaderBreadCrumbsProps {
  links: { label: string; to: string }[];
}

const HeaderBreadCrumbs = ({ links }: HeaderBreadCrumbsProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {links.map((link, index) => (
          <>
            <BreadcrumbItem key={index}>
              <BreadcrumbLink href={link.to}>{link.label}</BreadcrumbLink>
            </BreadcrumbItem>
            {index !== links.length - 1 && <BreadcrumbSeparator />}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default HeaderBreadCrumbs;
