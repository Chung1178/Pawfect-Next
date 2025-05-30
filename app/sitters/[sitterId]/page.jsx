import SitterImageGallery from '@/app/ui/components/SitterImageGallery';
import style from '@/app/ui/pages/sitters-page.module.scss';

export default async function SitterPage({ params }) {
  const { sitterId } = await params;
  const res = await fetch(`http://localhost:3001/users/${sitterId}`);
  const data = await res.json();
  const { profilePictureUrl, pictureUrls } = data;
  console.log(data);

  return (
    <>
      <h1>動態路由測試，id: {sitterId}</h1>
      <main>
        <section className={`bg-gradient-primary-banner`}>
          <div className={style['sitter-detail-banner']}>
            <div className="container pt-9 pt-lg-26">
              <div className="row">
                <div className="col-lg-8">
                  <SitterImageGallery profilePictureUrl={profilePictureUrl} pictureUrls={pictureUrls}  />
                </div>
                <div className="col-lg-4">
                  <div className="bg-light"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-gradient-light"></section>
      </main>
    </>
  );
}
