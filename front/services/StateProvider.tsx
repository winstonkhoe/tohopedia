import { useEffect, useState, createContext } from "react";
export const stateContext = createContext<any>({});

const StateProvider = (props: { children: any }) => {
  const [pollInterval, setPollInterval] = useState(3600000);
  const [tabIndexSetting, setTabIndexSetting] = useState(0);
  const [addressQuery, setAddressQuery] = useState("");
  const [pageTitle, setPageTitle] = useState("Tohopedia");

  return (
    <stateContext.Provider
      value={{
        addressQuery,
        setAddressQuery,
        tabIndexSetting,
        setTabIndexSetting,
        pageTitle,
        setPageTitle,
        pollInterval,
        setPollInterval
      }}
    >
      {props.children}
    </stateContext.Provider>
  );
};

export default StateProvider;
