"use client";

import qs from "query-string";
import { useEffect, useState } from "react";
import Container from "./Container";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import useLocation from "@/hook/useLocation";
import { ICity, IState } from "country-state-city";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { FaMapLocationDot } from "react-icons/fa6";

const LocationFilter = () => {
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const router = useRouter();
  const params = useSearchParams();

  const { getAllCountries, getCountryStates, getStateCities } = useLocation();

  const countries = getAllCountries();

  useEffect(() => {
    const countryStates = getCountryStates(country);
    if (countryStates) {
      setStates(countryStates);
      setState("");
      setCity("");
    }
  }, [country]);

  useEffect(() => {
    const stateCities = getStateCities(country, state);
    if (stateCities) {
      setCities(stateCities);
      setCity("");
    }
  }, [country, state]);

  useEffect(() => {
    if (country === "" && state === "" && city === "")
      return router.push("/homepage");

    let currentQuery: any = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    if (country) {
      currentQuery = {
        ...currentQuery,
        country,
      };
    }
    if (state) {
      currentQuery = {
        ...currentQuery,
        state,
      };
    }
    if (city) {
      currentQuery = {
        ...currentQuery,
        city,
      };
    }
    if (state === "" && currentQuery.state) {
      delete currentQuery.state;
    }
    if (city === "" && currentQuery.city) {
      delete currentQuery.city;
    }

    const url = qs.stringifyUrl(
      {
        url: "/homepage",
        query: currentQuery,
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  }, [country, state, city]);

  const handleClear = () => {
    setCountry("");
    setState("");
    setCity("");
    router.push("/homepage");
  };

  return (
    <Container>
      <div className="flex gap-2 md:gap-4 items-center justify-center text-sm">
        <h1 className="text-lg font-bold text-primary/90 text-center flex justify-center">
          <FaMapLocationDot className="mr-3" size={28} /> Filter by Location :
        </h1>
        <div>
          <Select onValueChange={(value) => setCountry(value)} value={country}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => {
                return (
                  <SelectItem key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select onValueChange={(value) => setState(value)} value={state}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              {states.length > 0 &&
                states.map((state) => {
                  return (
                    <SelectItem key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select onValueChange={(value) => setCity(value)} value={city}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              {cities.length > 0 &&
                cities.map((city) => {
                  return (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => handleClear()}>Clear Filters</Button>
      </div>
    </Container>
  );
};

export default LocationFilter;
function styled(
  Container: ({
    children,
  }: {
    children: import("react").ReactNode;
  }) => import("react").JSX.Element
) {
  throw new Error("Function not implemented.");
}
