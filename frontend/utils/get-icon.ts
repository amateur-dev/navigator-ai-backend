import {
  BookOpen,
  Bot,
  ChartNoAxesColumn,
  ChartSpline,
  Command,
  DatabaseZap,
  Flag,
  GalleryVerticalEnd,
  Globe,
  House,
  Settings2,
  SquareDashed,
  SquareTerminal,
  TvMinimal,
  User,
  UserPen,
  Users,
  Wrench
} from 'lucide-react'

export const getIcon = (icon: string) => {
  switch (icon) {
    case 'Users':
      return Users
    case 'ChartSpline':
      return ChartSpline
    case 'Bot':
      return Bot
    case 'BookOpen':
      return BookOpen
    case 'Command':
      return Command
    case 'GalleryVerticalEnd':
      return GalleryVerticalEnd
    case 'Settings2':
      return Settings2
    case 'SquareTerminal':
      return SquareTerminal
    case 'User':
      return User
    case 'UserPen':
      return UserPen
    case 'ChartNoAxesColumn':
      return ChartNoAxesColumn
    case 'Wrench':
      return Wrench
    case 'Flag':
      return Flag
    case 'TvMinimal':
      return TvMinimal
    case 'DatabaseZap':
      return DatabaseZap
    case 'Globe':
      return Globe
    case 'House':
      return House
    default:
      return SquareDashed
  }
}
