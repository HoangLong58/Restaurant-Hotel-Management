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

const PDFFile = (props) => {
    const totalObject = props.data.data;
    const totalDataTable = props.dataTable;
    console.log("totalDataTable: ", props.dataTable)

    return (
        <Document>
            <Page style={styles.body}>
                <Image style={{ width: "50px", height: "50px" }} src="https://i.ibb.co/DkbxyCK/favicon-logo.png" />
                <Text style={styles.header} fixed>Thống kê doanh thu Đặt phòng từng Quý năm 2022</Text>
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
                        <DataTableCell getContent={(r) => format_money(r.total) + "đ"} />
                    </TableBody>
                </Table>
                <Image style={styles.image} src={props.image} />
                <Text style={styles.header}> Biểu đồ thống kê doanh thu Đặt phòng từng Quý năm 2022</Text>
                {/* <Text style={styles.text}>
                    Biểu đồ thống kê doanh thu Đặt phòng từng Quý năm 2022
                </Text> */}
                <Table
                    data={totalDataTable}
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
                            Loại phòng
                        </TableCell>
                        <TableCell>
                            Vị trí phòng
                        </TableCell>
                        <TableCell>
                            Tổng tiền
                        </TableCell>
                    </TableHeader>
                    <TableBody>
                        <DataTableCell getContent={(r) => r.customer_first_name + " " + r.customer_last_name} />
                        <DataTableCell getContent={(r) => r.customer_email} />
                        <DataTableCell getContent={(r) => r.customer_phone_number} />
                        <DataTableCell getContent={(r) => r.room_booking_order_address + ", " + r.ward_name + ", " + r.district_name + ", " + r.city_name} />
                        <DataTableCell getContent={(r) => r.room_booking_order_start_date} />
                        <DataTableCell getContent={(r) => r.room_booking_order_finish_date} />
                        <DataTableCell getContent={(r) => r.room_type_name} />
                        <DataTableCell getContent={(r) => r.floor_name + ", " + r.room_name} />
                        <DataTableCell getContent={(r) => format_money(r.room_booking_order_total) + "đ"} />
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

export default PDFFile;