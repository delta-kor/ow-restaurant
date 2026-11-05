import { FC, SVGProps, SVGSVGElement } from 'react'

declare global {
  module '*.svg' {
    const component: FC<SVGProps<SVGSVGElement>>
    export default component
  }

  module "*.css" {
    const content: { [className: string]: string };
    export default content;
  }
}
