import GroupPage from "./GroupPage"

export default function Page({ params }) {
  return <GroupPage groupId={params.group} />
}
