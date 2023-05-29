export function numberWithSpaces (x: number): string {
  // returns number as string with spaces between thousands
  try {
    const parts = x.toString().split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    return parts.join('.')
  } catch (error) {
    return ''
  }
}
