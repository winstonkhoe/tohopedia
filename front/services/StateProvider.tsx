import { useEffect, useState, createContext } from "react";
export const stateContext = createContext<any>({});

const StateProvider = (props: { children: any }) => {
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
      }}
    >
      {props.children}
    </stateContext.Provider>
  );
};

export default StateProvider;
