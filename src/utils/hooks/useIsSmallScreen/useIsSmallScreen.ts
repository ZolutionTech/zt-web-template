import { useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

const useIsSmallScreen = () => {
  const { breakpoints } = useMantineTheme()
  const isSmallScreen = useMediaQuery(`(max-width: ${breakpoints.sm})`)

  return isSmallScreen
}

export default useIsSmallScreen
