export default async function SitterPage({ params }) {
    const { sitterId } = await params;
    const res = await fetch(`http://localhost:3001/users/${sitterId}`)
    const data = await res.json();
    console.log(data);

    return (
        <>
        <h1>動態路由測試，id: { sitterId }</h1>
        </>
    )
}