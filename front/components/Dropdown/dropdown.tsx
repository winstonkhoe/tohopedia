import Image from "next/image";
import { useState } from "react";
import styles from "./dropdown.module.scss";

function Dropdown(props: { children: any; selected: any }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`${
        open == false ? styles.option_wrapper_close : styles.option_wrapper_open
      } ${styles.container}`}
    >
      <button
        className={`${styles.dropdown_select} ${
          open ? styles.dropdown_select_open : ""
        }`}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <label>
          {props?.selected}
        </label>
      </button>
      <div className={styles.option_list_wrapper}>
        <ul>{props?.children}</ul>
      </div>
    </div>
  );
}

function DropdownItemList(props: { children: any; active: boolean }) {
  return (
    <li className={props.active ? styles.active_item : ""}>
      <button>{props?.children}</button>
    </li>
  );
}

function DropdownItemProfile(props: {
  name: string;
  image: string;
  desc?: string;
}) {
  return (
    <>
      <div className={styles.item_profile}>
        <div className={styles.item_profile_relative}>
          <Image src={props.image} alt="" layout="fill" objectFit="contain" />
        </div>
      </div>
      <span className={styles.profile_detail}>
        <div>
          <p>{props?.name}</p>
          <p className={styles.description}>{props?.desc}</p>
        </div>
      </span>
    </>
  );
}

// function DropdownItem(props: { children: any; onSelected?: any }) {
//   var initial = false;
//   const handleSelectedChange = (value: boolean) => {
//     props.onSelected(value);
//   };

//   return (
//     <button
//       onClick={() => {
//         handleSelectedChange(!initial);
//       }}
//     >
//       <label>{props?.children}</label>
//     </button>
//   );
// }

export {
  Dropdown,
  // DropdownItem,
  DropdownItemList,
  DropdownItemProfile,
};
