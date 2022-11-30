import { DataTableCell, Table, TableBody, TableCell, TableHeader } from '@david.kucsai/react-pdf-table';
import { Document, Font, Image, Page, StyleSheet, Text } from '@react-pdf/renderer';
import React from 'react';
import { format_money } from '../../utils/utils';

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

const PDFFileCity = (props) => {
    const totalOfCityForEachQuarter = props.data;
    const totalOfCityForEachQuarterDataTable = props.dataTable;
    console.log("totalOfCityForEachQuarter: ", totalOfCityForEachQuarter);
    return (
        <Document>
            <Page style={styles.body}>
                <Image style={{ width: "50px", height: "50px" }} src="https://i.ibb.co/DkbxyCK/favicon-logo.png" />
                <Text style={styles.header} fixed>Thống kê 5 Thành phố có doanh thu Đặt bàn cao nhất các Quý 2022</Text>
                <Table
                    data={totalOfCityForEachQuarter.data}
                >
                    <TableHeader>
                        <TableCell>
                            Tên thành phố
                        </TableCell>
                        <TableCell>
                            Quý 1
                        </TableCell>
                        <TableCell>
                            Quý 2
                        </TableCell>
                        <TableCell>
                            Quý 3
                        </TableCell>
                        <TableCell>
                            Quý 4
                        </TableCell>
                        <TableCell>
                            Cả năm
                        </TableCell>
                    </TableHeader>
                    <TableBody>
                        <DataTableCell getContent={(r) => r.city_name} />
                        <DataTableCell getContent={(r) => format_money(r.quy1) + "đ"} />
                        <DataTableCell getContent={(r) => format_money(r.quy2) + "đ"} />
                        <DataTableCell getContent={(r) => format_money(r.quy3) + "đ"} />
                        <DataTableCell getContent={(r) => format_money(r.quy4) + "đ"} />
                        <DataTableCell getContent={(r) => format_money(r.canam) + "đ"} />
                    </TableBody>
                </Table>
                <Image style={styles.image} src={props.image} />
                <Text style={styles.header}> Biểu đồ thống kê 5 Thành phố có doanh thu Đặt bàn cao nhất các Quý 2022</Text>
                {/* <Text style={styles.text}>
                    Biểu đồ thống kê doanh thu Đặt bàn từng Quý năm 2022
                </Text> */}
                <Table
                    data={totalOfCityForEachQuarterDataTable}
                >
                    <TableHeader>
                        <TableCell>
                            Họ tên
                        </TableCell>
                        <TableCell>
                            Email
                        </TableCell>
                        <TableCell>
                            Số điện thoại
                        </TableCell>
                        <TableCell>
                            Địa chỉ
                        </TableCell>
                        <TableCell>
                            Ngày Checkin
                        </TableCell>
                        <TableCell>
                            Ngày Checkout
                        </TableCell>
                        <TableCell>
                            Bàn số
                        </TableCell>
                        <TableCell>
                            Vị trí Bàn
                        </TableCell>
                        <TableCell>
                            Tổng tiền
                        </TableCell>
                    </TableHeader>
                    <TableBody>
                        <DataTableCell getContent={(r) => r.customer_first_name + " " + r.customer_last_name} />
                        <DataTableCell getContent={(r) => r.customer_email} />
                        <DataTableCell getContent={(r) => r.customer_phone_number} />
                        <DataTableCell getContent={(r) => r.table_booking_order_address + ", " + r.ward_name + ", " + r.district_name + ", " + r.city_name} />
                        <DataTableCell getContent={(r) => r.table_booking_order_start_date} />
                        <DataTableCell getContent={(r) => r.table_booking_order_finish_date} />
                        <DataTableCell getContent={(r) => r.table_booking_name} />
                        <DataTableCell getContent={(r) => r.table_type_name + ", " + r.floor_name} />
                        <DataTableCell getContent={(r) => format_money(r.table_booking_order_total) + "đ"} />
                    </TableBody>
                </Table>
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

export default PDFFileCity;