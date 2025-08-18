import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WebGL Text Demo - SSG',
  description: 'Demonstration of responsive and SEO-friendly WebGL text with custom shader effects',
}

export default function WebGLTextDemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}