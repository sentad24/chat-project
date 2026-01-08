import GroupPage from "./GroupPage";

export default async function Page({ params: { group } }) {
  // You can fetch group data here if needed
  const res = await fetch(`/api/groups/${group}`);
  const groupData = await res.json();

  return <GroupPage groupId={group} groupData={groupData} />;
}
