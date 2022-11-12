import React from 'react';
import { Page, Text, Image, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { Table, TableHeader, TableCell, TableBody, DataTableCell } from '@david.kucsai/react-pdf-table';

// Register Font
Font.register({
    family: "Roboto",
    src:
        "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf"
});

const styles = StyleSheet.create({
    body: {
        fontFamily: "Roboto",
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
    },
    title: {
        fontSize: 24,
        textAlign: "center",
    },
    text: {
        margin: 12,
        fontSize: 14,
        textAlign: "justify",
    },
    image: {
        marginVertical: 15,
        marginHorizontal: 20,
    },
    header: {
        fontSize: 12,
        marginBottom: 20,
        textAlign: "center",
        color: "black",
    },
    pageNumber: {
        position: "absolute",
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: "center",
        color: "grey"
    }
});

const PDFFileByQuarter = (props) => {
    const statisticQuarterArray = props.data.data;
    console.log("statisticQuarterArray: ", statisticQuarterArray);
    const quarter = props.data.quarter;
    return (
        <Document>
            <Page style={styles.body}>
                <Image style={{ width: "50px", height: "50px" }} src="https://i.ibb.co/DkbxyCK/favicon-logo.png" />
                <Text style={styles.header} fixed>Thống kê doanh thu Đặt phòng từng tháng trong Quý {quarter} năm 2022</Text>
                <Table
                    data={statisticQuarterArray}
                >
                    <TableHeader>
                        <TableCell>
                            Tháng
                        </TableCell>
                        <TableCell>
                            Doanh thu
                        </TableCell>
                    </TableHeader>
                    <TableBody>
                        <DataTableCell getContent={(r) => r.month} />
                        <DataTableCell getContent={(r) => r.data} />
                    </TableBody>
                </Table>
                <Image style={styles.image} src={props.image} />
                <Text style={styles.header} fixed> Biểu đồ thống kê doanh thu Đặt phòng từng tháng trong Quý {quarter} năm 2022</Text>
                {/* <Text style={styles.text}>
                    Biểu đồ thống kê doanh thu Đặt phòng từng Quý năm 2022
                </Text> */}
                <Text
                    style={styles.pageNumber}
                    render={({ pageNumber, totalPages }) =>
                        `${pageNumber} / ${totalPages}`
                    }
                />
            </Page>
        </Document>
    );
};

export default PDFFileByQuarter;