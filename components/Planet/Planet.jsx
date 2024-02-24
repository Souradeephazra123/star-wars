"use client";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import Image from "next/image";

const Planet = () => {
  const [isLoading, setisLoading] = useState(true);
  const [planets, setPlanets] = useState([]);
  const [prevPage, setPrevpage] = useState(null);
  const [nextPage, setNextpage] = useState(null);
  const [error, setError] = useState(null);

  // Function to fetch resident data from a URL
  const fetchResidentData = async (residentUrl) => {
    try {
      const response = await fetch(residentUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch resident data");
      }
      const residentData = await response.json();
      return residentData;
    } catch (error) {
      console.error("Error fetching resident data:", error);
      throw error;
    }
  };
  const [url, setUrl] = useState("https://swapi.dev/api/planets/?format=json");

  //   let url = "https://swapi.dev/api/planets/?format=json";
  // Fetch planet data on component mount
  //   useEffect(() => {
  const fetchPlanetData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch planet data");
      }
      const data = await response.json();
      // Extracting results from data
      const planetResults = data.results;
      //   setPlanets(planetResults);
      setPrevpage(data.previous);
      setNextpage(data.next);
      // Fetch resident data for each planet
      const planetsWithResidents = await Promise.all(
        planetResults.map(async (planet) => {
          // Fetch resident data for each resident URL
          try {
            const residentsData = await Promise.all(
              planet.residents.map(async (residentUrl) => {
                const residentData = await fetchResidentData(residentUrl);
                // Extracting required information from resident data
                return {
                  name: residentData.name,
                  height: residentData.height,
                  mass: residentData.mass,
                  gender: residentData.gender,
                };
              })
            );
            return {
              ...planet,
              residents: residentsData, // Replace resident URLs with resident data
            };
          } catch (error) {
            console.error("Error fetching residents for planet:", planet.name);
            return { ...planet, residents: [] }; // Provide empty residents array
          }
        })
      );
      setPlanets(planetsWithResidents);
      setisLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again later.");
    }
  };

  useEffect(() => {
    fetchPlanetData(url);
  }, [url]);

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
    <div className="   flex justify-center flex-col sm:px-[10px] md:px-[20px] lg:px-[30px] my-10">
      <h1 className="flex text-slate-300  justify-center text-3xl my-3">
        Planet
      </h1>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="  flex flex-wrap justify-center gap-5">
            {planets.map((planet, idx) => (
              <div
                key={idx}
                className=" planet-member flex flex-col flex-wrap  gap-5 w-[300px]  rounded-md shadow-md p-5 bg-[#C8998F]"
              >
                <h2>Planet Name: {planet.name}</h2>
                <p>Climate: {planet.climate}</p>
                <p>Population: {planet.population}</p>
                <p>Terrain: {planet.terrain}</p>
                <h1>Residents :</h1>
                <ul className=" flex flex-col gap-2 pl-16 ">
                  {planet.residents.length > 0
                    ? planet.residents.map((resident, idx) => (
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
                    : "There are no residents in this planet"}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex justify-between p-5">
            <button
              onClick={() => {
                handlePrevClick();
              }}
              disabled={!prevPage}
              className={`bg-slate-500 text-white px-5 py-2 rounded-md
     
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
