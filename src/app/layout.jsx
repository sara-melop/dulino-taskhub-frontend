import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'

export const metadata = {
  title: 'TaskHub',
  description: 'Gerenciador de tarefas',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
