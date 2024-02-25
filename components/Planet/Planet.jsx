"use client";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";

const Planet = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [planets, setPlanets] = useState([]);
  const [prevPage, setPrevPage] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [error, setError] = useState(null);
  const [expandedPlanetIndex, setExpandedPlanetIndex] = useState(null);
  const [url, setUrl] = useState(
    "https://swapi.dev/api/planets/?page=1&format=json"
  );

  const fetchPlanets = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch planet data");
      }
      const data = await response.json();
      setPrevPage(data.previous);
      console.log(prevPage);
      setNextPage(data.next);

      return data.results.map((planet) => ({
        ...planet,
        residents: planet.residents, // Initially empty, will be loaded lazily
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  useEffect(() => {
    const initialFetch = async () => {
      try {
        const initialPlanets = await fetchPlanets(url);
        setPlanets(initialPlanets);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setError("Failed to fetch initial data. Please try again later.");
        setIsLoading(false);
      }
    };

    initialFetch();
  }, [url]);

  const toggleExpand = async (index) => {
    if (index === expandedPlanetIndex) {
      setExpandedPlanetIndex(null);
      return;
    }

    const planetToUpdate = planets[index];

    try {
      const residentsData = await Promise.all(
        planetToUpdate.residents.map(async (residentUrl) => {
          const response = await fetch(residentUrl);
          if (!response.ok) {
            throw new Error("Failed to fetch resident data");
          }
          return await response.json();
        })
      );

      // Update the residents array of the specific planet with fetched resident data
      const updatedPlanet = {
        ...planetToUpdate,
        residents: residentsData.map((resident) => ({
          name: resident.name,
          height: resident.height,
          mass: resident.mass,
          gender: resident.gender,
        })),
      };
      // Update the planets array by replacing the specific planet with the updated one
      setPlanets((prevPlanets) => [
        ...prevPlanets.slice(0, index),
        updatedPlanet,
        ...prevPlanets.slice(index + 1),
      ]);
    } catch (error) {
      console.error("Error fetching resident data:", error);
      setError("Failed to fetch resident data. Please try again later.");
    }

    setExpandedPlanetIndex(index);
  };

  const handleNextClick = () => {
    if (nextPage) {
      setUrl(nextPage);
    }
  };

  const handlePrevClick = () => {
    if (prevPage) {
      setUrl(prevPage);
    }
  };

  return (
    <div className="flex justify-center flex-col sm:px-[10px] md:px-[20px] lg:px-[30px] my-10">
      <h1 className="flex  text-slate-300 justify-center text-3xl my-3">
        Planet
      </h1>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="flex flex-wrap justify-center gap-5">
            {planets.map((planet, idx) => (
              <div
                key={idx}
                className="planet-member flex flex-col flex-wrap gap-5 w-[300px] rounded-md shadow-md p-5 bg-[#C8998F]"
              >
                <h2>Planet Name: {planet.name}</h2>
                <p>Climate: {planet.climate}</p>
                <p>Population: {planet.population}</p>
                <p>Terrain: {planet.terrain}</p>
                <h1>Residents :</h1>
                {expandedPlanetIndex === idx && (
                  <ul className="flex flex-col gap-2 pl-16">
                    {planet.residents.length > 0 ? (
                      planet.residents.map((resident, idx) => (
                        <li
                          key={idx}
                          className="planet-resident-member text-sm border border-slate-400 p-2 rounded-md bg-slate-400 shadow-md"
                        >
                          <p>Name: {resident.name}</p>
                          <p>Height: {resident.height}</p>
                          <p>Mass: {resident.mass}</p>
                          <p>Gender: {resident.gender}</p>
                        </li>
                      ))
                    ) : (
                      <li>There are no residents in this planet</li>
                    )}
                  </ul>
                )}
                <button
                  onClick={() => toggleExpand(idx)}
                  className="bg-blue-500 text-white px-5 py-2 rounded-md"
                >
                  {expandedPlanetIndex === idx ? "Collapse" : "Expand"}
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between p-5">
            <button
              onClick={() => {
                handlePrevClick();
              }}
              disabled={!prevPage}
              className={` text-white px-5 py-2 rounded-md
${!prevPage ? "bg-slate-500" : "bg-blue-500"}
              `}
            >
              Previous
            </button>
            <button
              onClick={() => {
                handleNextClick();
              }}
              disabled={!nextPage}
              className={`bg-slate-500 text-white px-5 py-2 rounded-md
              ${!nextPage ? "bg-slate-500" : "bg-blue-500"}
               `}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Planet;
