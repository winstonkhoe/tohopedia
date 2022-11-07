import Link from "next/link";
import { useState } from "react";
import styles from "./Accordion.module.scss";

function Accordion(props: { header: string; children: any }) {
  const [accordionOpen, setAccordionOpen] = useState(true);
  return (
    <div className={styles.settings_user_utilities_accordion_container}>
      <button className={styles.settings_user_utilities_accordion_button}>
        <h6 className={styles.settings_user_utilities_accordion_header}>
          {props.header}
        </h6>
        <div
          className={styles.settings_user_utilities_accordion_icon}
          onClick={() => {
            setAccordionOpen(!accordionOpen);
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="var(--color-icon-enabled, #525867)"
            style={
              accordionOpen === true
                ? { transform: "rotate(-180deg)" }
                : { transform: "" }
            }
          >
            <path d="M12 15.5a.999.999 0 01-.71-.29l-5-5a1.004 1.004 0 111.42-1.42l4.29 4.3 4.29-4.3a1.004 1.004 0 011.42 1.42l-5 5a1 1 0 01-.71.29z"></path>
          </svg>
        </div>
      </button>
      <ul
        className={
          accordionOpen === true
            ? styles.settings_user_utilities_accordion_items_open
            : styles.settings_user_utilities_accordion_items_close
        }
      >
        {props.children}
        {/* <li className={styles.settings_user_utilities_accordion_item_container}>
          <button className={styles.settings_user_utilities_accordion_item}>
            <p
              className={
                styles.settings_user_utilities_accordion_item_inner_container
              }
            >
              <Link href={"/user/chat"}>
                <a
                  className={
                    styles.settings_user_utilities_accordion_item_label
                  }
                  href=""
                >
                  Chat
                  <span
                    className={
                      styles.settings_user_utilities_accordion_item_value
                    }
                  >
                    7
                  </span>
                </a>
              </Link>
            </p>
          </button>
        </li>
        <li className={styles.settings_user_utilities_accordion_item_container}>
          <button className={styles.settings_user_utilities_accordion_item}>
            <p
              className={
                styles.settings_user_utilities_accordion_item_inner_container
              }
            >
              <Link href={"/user/chat"}>
                <a
                  className={
                    styles.settings_user_utilities_accordion_item_label
                  }
                  href=""
                >
                  Ulasan
                  <span
                    className={
                      styles.settings_user_utilities_accordion_item_value
                    }
                  >
                    7
                  </span>
                </a>
              </Link>
            </p>
          </button>
        </li> */}
      </ul>
    </div>
  );
}

function AccordionItemNotif(props: {
  name: string;
  href?: any;
  notifCount?: number;
}) {
  return (
    <li className={styles.settings_user_utilities_accordion_item_container}>
      <button className={styles.settings_user_utilities_accordion_item}>
        <p
          className={
            styles.settings_user_utilities_accordion_item_inner_container
          }
        >
          {props?.href ? (
            <Link href={props?.href}>
              <a
                className={styles.settings_user_utilities_accordion_item_label}
              >
                {props?.name}
                {props?.notifCount ? (
                  <span
                    className={
                      styles.settings_user_utilities_accordion_item_value
                    }
                  >
                    {props?.notifCount}
                  </span>
                ) : null}
              </a>
            </Link>
          ) : (
            <a className={styles.settings_user_utilities_accordion_item_label}>
              {props?.name}
              {props?.notifCount ? (
                <span
                  className={
                    styles.settings_user_utilities_accordion_item_value
                  }
                >
                  {props?.notifCount}
                </span>
              ) : null}
            </a>
          )}
        </p>
      </button>
    </li>
  );
}

function AccordionItem(props: { children: any }) {
  return (
    <li className={styles.settings_user_utilities_accordion_item_container}>
      {props?.children}
    </li>
  );
}

export { Accordion, AccordionItem, AccordionItemNotif };
