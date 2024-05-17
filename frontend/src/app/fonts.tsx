import { Inter, Roboto } from 'next/font/google'
 
export const inter = Inter({
  subsets: ['latin'],
  weight: ['400',"300", '500', '700', '900'],
  display: 'swap',
  variable:'--inter'
})
 
export const roboto = Roboto({
    weight: ['400',"300", '500', '700', '900'],
    subsets: ['latin'],
    variable:'--roboto'
})