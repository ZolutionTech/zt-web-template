export const getWeekdayFromIndex = (index: number): string => {
  // Return in Danish, start with Mandag

  const weekdays = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag']

  return weekdays[index]
}
