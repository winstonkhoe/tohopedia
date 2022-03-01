import styles from "./overlay.module.scss"
const Overlay = (props: { children: any }) => {
    return (
        <>
            <div className={styles.container}></div>
            {props.children}
        </>
    )
}

export default Overlay