{/* Cities List */}
        <section className="space-y-12 mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">The 10 Most Memorable Cities</h2>

          {cities.map((city) => (
            <div key={city.rank} className="bg-white rounded-xl shadow-lg overflow-hidden border-l-8 border-blue-600">
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center">
                      <span className="text-3xl font-bold">#{city.rank}</span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900">{city.name}</h3>
                      <p className="text-lg text-gray-600">{city.state}</p>
                    </div>
                  </div>
                  <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg px-4 py-2">
                    <p className="text-sm font-bold text-yellow-800">📊 {city.population}</p>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 rounded-r-lg p-6 mb-6">
                  <h4 className="font-bold text-gray-900 mb-2">What Makes It Memorable</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {city.highlight}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span>🏘️</span> Key Filipino Districts
                  </h4>
                  <p className="text-gray-600">
                    {city.keyDistricts}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-700">
                    <strong>Featured in this guide:</strong> Cultural history, migration patterns, 
                    community gathering places, and the food traditions that define Filipino life in {city.name}.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>