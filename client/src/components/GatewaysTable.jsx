import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { useSelector, useDispatch } from 'react-redux'
import { updatingMode } from '../features/hideGateway/hideGatewaySlice';
import { useDeleteGatewayMutation, useGatewaysQuery } from '../features/api/apiSlice';
import Loading from './Loading';
import ModalAdd from './modalAdd';
import DeleteForm from './DeleteForm';


function createData(serialNumber, humanName, ipAddress) {
    return {
        serialNumber,
        humanName,
        ipAddress
    };
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'serialNumber',
        numeric: false,
        disablePadding: true,
        label: 'Serial Number',
    },
    {
        id: 'humanName',
        numeric: false,
        disablePadding: false,
        label: 'Human Name',
    },
    {
        id: 'ipAddress',
        numeric: false,
        disablePadding: false,
        label: 'Ip Address',
    }
];

const DEFAULT_ORDER = 'asc';
const DEFAULT_ORDER_BY = 'serialNumber';
const DEFAULT_ROWS_PER_PAGE = 5;

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (newOrderBy) => (event) => {
        onRequestSort(event, newOrderBy);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { numSelected, selected } = props;
    const [deleteGateway] = useDeleteGatewayMutation();
    const handleDelete = () => {
        selected.forEach(el => {
            deleteGateway(el);
        })
    }
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Gateways
                </Typography>
            )}

            {numSelected > 0 && (
                <Tooltip title="Delete" onClick={handleDelete}>
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export default function GatewaysTable() {
    const [order, setOrder] = React.useState(DEFAULT_ORDER);
    const [orderBy, setOrderBy] = React.useState(DEFAULT_ORDER_BY);
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [visibleRows, setVisibleRows] = React.useState(null);
    const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE);
    const [paddingHeight, setPaddingHeight] = React.useState(0);

    const hideGateway = useSelector(state => state.hideGateway.value);
    const dispatch = useDispatch();

    const { data: rows, isError, isLoading, error } = useGatewaysQuery();


    React.useEffect(() => {

        fetch("http://localhost:3000/api/gateways")
            .then(res => res.json())
            .then(rows => {
                let rowsOnMount = stableSort(
                    rows,
                    getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY),
                );

                rowsOnMount = rowsOnMount.slice(
                    0 * DEFAULT_ROWS_PER_PAGE,
                    0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
                );

                setVisibleRows(rowsOnMount);
            })

    }, [rows]);

    const handleRequestSort = React.useCallback(
        (event, newOrderBy) => {
            const isAsc = orderBy === newOrderBy && order === 'asc';
            const toggledOrder = isAsc ? 'desc' : 'asc';
            setOrder(toggledOrder);
            setOrderBy(newOrderBy);

            const sortedRows = stableSort(rows, getComparator(toggledOrder, newOrderBy));
            const updatedRows = sortedRows.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            );

            setVisibleRows(updatedRows);
        },
        [order, orderBy, page, rowsPerPage],
    );

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.serialNumber);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = React.useCallback(
        (event, newPage) => {
            fetch("http://localhost:3000/api/gateways")
                .then(res => res.json())
                .then(rows => {
                    setPage(newPage);
                    const sortedRows = stableSort(rows, getComparator(order, orderBy));
                    const updatedRows = sortedRows.slice(
                        newPage * rowsPerPage,
                        newPage * rowsPerPage + rowsPerPage,
                    );

                    setVisibleRows(updatedRows);

                    // Avoid a layout jump when reaching the last page with empty rows.
                    const numEmptyRows =
                        newPage > 0 ? Math.max(0, (1 + newPage) * rowsPerPage - rows.length) : 0;

                    const newPaddingHeight = (dense ? 33 : 53) * numEmptyRows;
                    setPaddingHeight(newPaddingHeight);
                })

        },
        [order, orderBy, dense, rowsPerPage],
    );

    const handleChangeRowsPerPage = React.useCallback(
        (event) => {
            fetch("http://localhost:3000/api/gateways")
                .then(res => res.json())
                .then(rows => {
                    const updatedRowsPerPage = parseInt(event.target.value, 10);
                    setRowsPerPage(updatedRowsPerPage);

                    setPage(0);

                    const sortedRows = stableSort(rows, getComparator(order, orderBy));
                    const updatedRows = sortedRows.slice(
                        0 * updatedRowsPerPage,
                        0 * updatedRowsPerPage + updatedRowsPerPage,
                    );

                    setVisibleRows(updatedRows);

                    // There is no layout jump to handle on the first page.
                    setPaddingHeight(0);
                })

        },
        [order, orderBy],
    );

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    if (isLoading) return <div className="loading"><Loading /></div>

    return (
        rows && <div className={hideGateway ? "hideGateway" : ""}>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <EnhancedTableToolbar numSelected={selected.length} selected={selected} />
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={dense ? 'small' : 'medium'}
                        >
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                            />
                            <TableBody>
                                {visibleRows
                                    ? visibleRows.map((row, index) => {
                                        const isItemSelected = isSelected(row.idGat);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                key={row.idGat}
                                                sx={{ cursor: 'pointer' }}
                                                selected={isItemSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                        onClick={(event) => handleClick(event, row.idGat)}
                                                        role="checkbox"
                                                        aria-checked={isItemSelected}
                                                        tabIndex={-1}

                                                    />
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                    title="Click on it to go to Devices"
                                                    onClick={() => {
                                                        dispatch(updatingMode({ value: true, idGat: row.idGat, serialNumber: row.serialNumber }));
                                                    }}
                                                >
                                                    {row.serialNumber}
                                                </TableCell>
                                                <TableCell
                                                    title="Click on it to go to Devices"
                                                    onClick={() => {
                                                        dispatch(updatingMode({ value: true, idGat: row.idGat, serialNumber: row.serialNumber }));
                                                    }}>
                                                    {row.humanName}
                                                </TableCell>
                                                <TableCell
                                                    title="Click on it to go to Devices"
                                                    onClick={() => {
                                                        dispatch(updatingMode({ value: true, idGat: row.idGat, serialNumber: row.serialNumber }));
                                                    }}>
                                                    {row.ipAddress}
                                                </TableCell>

                                            </TableRow>
                                        );
                                    })
                                    : null}
                                {paddingHeight > 0 && (
                                    <TableRow
                                        style={{
                                            height: paddingHeight,
                                        }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <ModalAdd />
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </div>
                </Paper>
                <FormControlLabel
                    control={<Switch checked={dense} onChange={handleChangeDense} />}
                    label="Dense padding"
                />
            </Box>
        </div>
    );
}