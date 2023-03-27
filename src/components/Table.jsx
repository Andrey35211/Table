import React, {useCallback, useMemo, useState, useRef} from 'react';
import MaterialReactTable from 'material-react-table';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { IMaskInput } from 'react-imask';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Tooltip,
} from '@mui/material';
import {ExportToCsv} from 'export-to-csv';
import {Delete, Edit, ContentCopy} from '@mui/icons-material';
import {data, termsOfUse} from '../store/store.js';

const Example = () => {

        const handleExportRows = (rows) => {
            csvExporter.generateCsv(rows.map((row) => row.original));
        };

        const handleExportData = () => {
            csvExporter.generateCsv(data);
        };
        const [createModalOpen, setCreateModalOpen] = useState(false);
        const [tableData, setTableData] = useState(() => data);
        const [validationErrors, setValidationErrors] = useState({});

        const handleCreateNewRow = (values) => {
            tableData.push(values);
            setTableData([...tableData]);
        };


        const handleSaveRowEdits = async ({exitEditingMode, row, values}) => {
            if (!Object.keys(validationErrors).length) {
                tableData[row.index] = values;
                //send/receive api updates here, then refetch or update local table data for re-render
                setTableData([...tableData]);
                exitEditingMode(); //required to exit editing mode and close modal
            }
        };

        const handleCancelRowEdits = () => {
            setValidationErrors({});
        };

        const handleDeleteRow = useCallback(
            (row) => {
                if (
                    !confirm(`Are you sure you want to delete ${row.getValue('Name')}`)
                ) {
                    return;
                }
                //send api delete request here, then refetch or update local table data for re-render
                tableData.splice(row.index, 1);
                setTableData([...tableData]);
            },
            [tableData],
        );

        const getCommonEditTextFieldProps = useCallback(
            (cell) => {
                return {
                    error: !!validationErrors[cell.id],
                    helperText: validationErrors[cell.id],
                    onBlur: (event) => {
                        const isValid =
                            cell.column.id === 'years'
                                ? validateYears(event.target.value)
                                : cell.column.id === 'Temperature'
                                    ? validateTemperature(+event.target.value)
                                    : validateRequired(event.target.value);
                        if (!isValid) {
                            //set validation error for cell if invalid
                            setValidationErrors({
                                ...validationErrors,
                                [cell.id]: `${cell.column.columnDef.header} is required`,
                            });
                        } else {
                            //remove validation error for cell if valid
                            delete validationErrors[cell.id];
                            setValidationErrors({
                                ...validationErrors,
                            });
                        }
                    },
                };
            },
            [validationErrors],
        );

        const columns = useMemo(
            () => [
                {
                    accessorKey: 'id',
                    header: 'ID',
                    enableColumnOrdering: false,
                    enableEditing: false, //disable editing on this column
                    enableSorting: false,
                    size: 80,
                    enableClickToCopy: true,
                    muiTableBodyCellCopyButtonProps: {
                        fullWidth: true,
                        startIcon: <ContentCopy/>,
                        sx: {justifyContent: 'flex-start'}
                    },
                },
                {
                    accessorKey: 'Name',
                    header: 'Name',
                    size: 140,
                    muiTableBodyCellEditTextFieldProps: ({cell}) => ({
                        ...getCommonEditTextFieldProps(cell),
                    }),
                },
                {
                    accessorKey: 'weight',
                    header: 'Weight',
                    size: 120,
                    muiTableBodyCellEditTextFieldProps: ({cell}) => ({
                        ...getCommonEditTextFieldProps(cell),
                        type: 'namber',
                    }),

                },
                {
                    accessorKey: 'Power',
                    header: 'Power consumption, W',
                    size: 60,
                    muiTableBodyCellEditTextFieldProps: ({cell}) => ({
                        ...getCommonEditTextFieldProps(cell),
                        type: 'number',
                    }),
                },
                {
                    accessorKey: 'termsOfUse',
                    header: 'terms of Use',
                    muiTableBodyCellEditTextFieldProps: {
                        select: true, //change to select for a dropdown
                        children: termsOfUse.map((termsOfUse) => (
                            <MenuItem key={termsOfUse} value={termsOfUse}>
                                {termsOfUse}
                            </MenuItem>
                        )),
                    },
                },
                {
                    accessorKey: 'Comment',
                    header: 'Comment',
                    size: 200,
                    muiTableBodyCellEditTextFieldProps: ({cell}) => ({
                        ...getCommonEditTextFieldProps(cell),
                        type: 'string',
                    }),
                },
            ],
            [getCommonEditTextFieldProps],
        );

        const csvOptions = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalSeparator: '.',
            showLabels: true,
            useBom: true,
            useKeysAsHeaders: false,
            headers: columns.map((c) => c.header),
        };

        const csvExporter = new ExportToCsv(csvOptions);

        return (
            <>
                <MaterialReactTable
                    displayColumnDefOptions={{
                        'mrt-row-actions': {
                            muiTableHeadCellProps: {
                                align: 'center',
                            },
                            size: 120,
                        },
                    }}
                    columns={columns}
                    data={tableData}
                    editingMode="modal" //default
                    enableColumnOrdering
                    enableEditing
                    enableRowSelection
                    positionToolbarAlertBanner="bottom"
                    onEditingRowSave={handleSaveRowEdits}
                    onEditingRowCancel={handleCancelRowEdits}
                    renderRowActions={({row, table}) => (
                        <Box sx={{display: 'flex', gap: '1rem'}}>
                            <Tooltip arrow placement="left" title="Edit">
                                <IconButton onClick={() => table.setEditingRow(row)}>
                                    <Edit/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip arrow placement="right" title="Delete">
                                <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                                    <Delete/>
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                    renderTopToolbarCustomActions={({table}) => (
                        <Box sx={{display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap'}}>
                            <Button
                                color="secondary"
                                onClick={() => setCreateModalOpen(true)}
                                variant="contained"
                            >
                                Create New Item
                            </Button>

                            <Button
                                color="primary"
                                // export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                                onClick={handleExportData}
                                startIcon={<FileDownloadIcon/>}
                                variant="contained"
                            >
                                Export All Data
                            </Button>
                            <Button
                                disabled={table.getRowModel().rows.length === 0}
                                //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                                onClick={() => handleExportRows(table.getRowModel().rows)}
                                startIcon={<FileDownloadIcon/>}
                                variant="contained"
                            >
                                Export Page Rows
                            </Button>
                            <Button
                                disabled={
                                    !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                                }
                                //only export selected rows
                                onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                                startIcon={<FileDownloadIcon/>}
                                variant="contained"
                            >
                                Export Selected Rows
                            </Button>
                        </Box>
                    )}
                />
                <CreateNewAccountModal
                    columns={columns}
                    open={createModalOpen}
                    onClose={() => setCreateModalOpen(false)}
                    onSubmit={handleCreateNewRow}
                />
            </>
        );
    }
;

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({open, columns, onClose, onSubmit}) => {
    const [values, setValues] = useState(() =>
        columns.reduce((acc, column) => {
            acc[column.accessorKey ?? ''] = '';
            return acc;
        }, {}),
    );

    const handleSubmit = () => {
        //put your validation logic here
        onSubmit(values);
        onClose();
    };

    return (
        <Dialog open={open}>
            <DialogTitle textAlign="center">Create New Account</DialogTitle>
            <DialogContent>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Stack
                        sx={{
                            width: '100%',
                            minWidth: {xs: '300px', sm: '360px', md: '400px'},
                            gap: '1.5rem',
                        }}
                    >
                        {columns.map((column) => (
                            <TextField
                                key={column.accessorKey}
                                label={column.header}
                                name={column.accessorKey}
                                onChange={(e) =>
                                    setValues({...values, [e.target.name]: e.target.value})
                                }
                            />
                        ))}
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions sx={{p: '1.25rem'}}>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="secondary" onClick={handleSubmit} variant="contained">
                    Create New Account
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const validateRequired = (value) => !!value.length;
// const validateEmail = (email) =>
//     !!email.length &&
//     email
//         .toLowerCase()
//         .match(
//             /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
//         );

// const inputTemperature = document.querySelectorAll('[data-mask="Temperature"]')
// const validateTemperature = { // создаем объект параметров
//     mask: Number + '°C',
//     thousandsSeparator: ' '
// }

// const validateTemperature = (Temperature) => age >= 18 && age <= 50;
const validateID = (id) =>
    id
        .match(/\D/g, '');

export default Example;
