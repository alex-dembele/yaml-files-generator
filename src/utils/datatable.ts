// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const customStyles2: any = {
    rows: {
        style: {
            minHeight: '72px', // override the row height
        },
    },
    headCells: {
        style: {
            paddingLeft: '8px', // override the cell padding for head cells
            paddingRight: '8px',
            justifyContent: "center",
        },
    },
    cells: {
        style: {
            textAlign: 'center',
            justifyContent: "center",
            paddingLeft: '8px', // override the cell padding for data cells
            paddingRight: '8px',
        },
    },
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const customStyles: any = {
    headCells: {
        style: {
            // color: "#121212",
            color: "#ffffff",
            fontSize: "1rem",
            fontWeight: 'bold',
            borderTopLeftRadius: "0px",
            // backgroundColor: "#F3F4F6",
            justifyContent: "center",
        },
    },
    headRow: {
        style: {
            borderRadius: "10px",
            backgroundColor: "#28a6d7",
            borderWidth: "1px"
        },
    },
    rows: {
        style: {
            "&:not(:last-of-type)": {
                borderBottomStyle: "solid",
            },
            textDecorationColor: "#20a8d8",
            '&:hover': {
                cursor: 'pointer',
                backgroundColor: "#F3F4F6"
            },
        },
    },
    cells: {
        style: {
            justifyContent: "center",
            fontSize: "1rem",
            color: "#6B7280",
            // borderBottomRadius: "10px",
            // "&:not(:last-of-type)": {
            "&:not(:last-of-type)": {
                // borderLeftStyle: "solid",
                // borderLeftWidth: "2px",
                // borderLeftColor: "#28a6d7",
                // borderRightStyle: "solid",
                // borderRightWidth: "2px",
                // borderEndEndRadius: "10px",
                // borderRightColor: "#28a6d7",
                // borderStyle: "solid",
                // borderWidth: "2px",
                // borderColor: "#28a6d7",
            },

            borderBottom: "1px solid #F3F4F6",

        },
    },
    pagination: {
        style: {
            backgroundColor: "#F3F4F6",
            borderRadius: "10px",
            color: "#121212"
        },
    },
}