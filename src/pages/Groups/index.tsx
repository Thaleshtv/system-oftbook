import { useGroups } from './model'
import { GroupsView } from './view'

export const Groups = () => {
  const modelGroups = useGroups()

  return <GroupsView {...modelGroups} />
}
