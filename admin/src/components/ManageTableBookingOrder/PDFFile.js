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

const PDFFile = (props) => {
    const totalObject = props.data.data;
    return (
        <Document>
            <Page style={styles.body}>
                <Image style={{ width: "50px", height: "50px" }} src="https://i.ibb.co/DkbxyCK/favicon-logo.png" />
                <Text style={styles.header} fixed>Thống kê doanh thu Đặt bàn từng Quý năm 2022</Text>
                <Table
                    data={[
                        {
                            stt: 1,
                            name: "Quý 1",
                            total: totalObject.quy1
                        },
                        {
                            stt: 2,
                            name: "Quý 2",
                            total: totalObject.quy2
                        },
                        {
                            stt: 3,
                            name: "Quý 3",
                            total: totalObject.quy3
                        },
                        {
                            stt: 4,
                            name: "Quý 4",
                            total: totalObject.quy4
                        },
                        {
                            stt: 5,
                            name: "Cả năm",
                            total: totalObject.canam
                        }
                    ]}
                >
                    <TableHeader>
                        <TableCell>
                            STT
                        </TableCell>
                        <TableCell>
                            Thời gian
                        </TableCell>
                        <TableCell>
                            Doanh thu
                        </TableCell>
                    </TableHeader>
                    <TableBody>
                        <DataTableCell getContent={(r) => r.stt} />
                        <DataTableCell getContent={(r) => r.name} />
                        <DataTableCell getContent={(r) => r.total} />
                    </TableBody>
                </Table>
                <Image style={styles.image} src={props.image} />
                <Text style={styles.header} fixed> Biểu đồ thống kê doanh thu Đặt bàn từng Quý năm 2022</Text>
                {/* <Text style={styles.text}>
                    Biểu đồ thống kê doanh thu Đặt bàn từng Quý năm 2022
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

export default PDFFile;