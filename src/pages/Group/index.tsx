import { useGroup } from './model'
import { GroupView } from './view'

export const Group = () => {
  const modelGroup = useGroup()

  return <GroupView {...modelGroup} />
}
