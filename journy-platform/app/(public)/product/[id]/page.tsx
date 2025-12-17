export default async function PublicProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  let wine = null;
  let error = null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/wines/${id}`, {
      cache: 'no-store',
    });

    if (response.ok) {
      wine = await response.json();
    } else {
      error = 'Wine not found';
    }
  } catch (err) {
    error = 'Failed to load wine data';
  }

  if (error || !wine) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Wine Not Found</h1>
          <p className="text-gray-600">{error || 'The wine you are looking for does not exist.'}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{wine.Name}</h1>
          <p className="text-2xl text-gray-600">{wine.BrandName}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            {wine.ImageURL && (
              <img 
                src={wine.ImageURL} 
                alt={wine.Name} 
                className="w-full rounded-lg"
              />
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold mb-2">Product Information</h2>
              <dl className="space-y-2">
                {wine.Type && (
                  <div>
                    <dt className="font-semibold">Type:</dt>
                    <dd>{wine.Type}</dd>
                  </div>
                )}
                {wine.WineYear && (
                  <div>
                    <dt className="font-semibold">Vintage:</dt>
                    <dd>{wine.WineYear}</dd>
                  </div>
                )}
                {wine.AlcoholVolume && (
                  <div>
                    <dt className="font-semibold">Alcohol:</dt>
                    <dd>{wine.AlcoholVolume}%</dd>
                  </div>
                )}
                {wine.Country && (
                  <div>
                    <dt className="font-semibold">Origin:</dt>
                    <dd>{wine.Country}, {wine.Region}</dd>
                  </div>
                )}
              </dl>
            </div>

            {wine.Ingredients && (
              <div>
                <h3 className="font-bold mb-2">Ingredients</h3>
                <p>{wine.Ingredients}</p>
              </div>
            )}

            {(wine.Kcal || wine.Carbs) && (
              <div>
                <h3 className="font-bold mb-2">Nutritional Information</h3>
                <dl className="space-y-1">
                  {wine.Kcal && <div>Calories: {wine.Kcal} kcal</div>}
                  {wine.Carbs && <div>Carbohydrates: {wine.Carbs}g</div>}
                  {wine.CarbsOfSugar && <div>of which sugars: {wine.CarbsOfSugar}g</div>}
                </dl>
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm">
          <p>Scanned via QR Code - Digital Product Passport</p>
        </div>
      </div>
    </main>
  );
}

