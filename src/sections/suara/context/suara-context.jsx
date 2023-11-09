import React, { createContext, useEffect, useState, useContext, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import { getSuara, deleteSuara } from 'src/sections/authentication/api-request/Suara';
import { getTimses, getTimsesId } from 'src/sections/authentication/api-request/Timses';
import { applyFilter, getComparator } from '../components/utils';
import { useUser } from 'src/sections/authentication/user/user-context';

const SuaraContext = createContext();

export const useSuara = () => useContext(SuaraContext);

export const SuaraProvider = ({ children }) => {
    const { userId } = useUser();
    const [rows, setRows] = useState([]); // eslint-disable-next-line
    const [suaraData, setSuaraData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('nama');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selected, setSelected] = useState([]);
    const [filterName, setFilterName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showAddAlert, setShowAddAlert] = useState(false);
    const [showEditAlert, setShowEditAlert] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [dataForEdit, setDataForEdit] = useState(null);
    const [dialogMode, setDialogMode] = useState(null);
    const [clientFilteredRows, setClientFilteredRows] = useState([]);
    const [timsesList, setTimsesList] = useState([]);


    // eslint-disable-next-line
    const DIALOG_MODE = {
        ADD: 'ADD',
        EDIT: 'EDIT',
    };

    const fetchTimses = useCallback(async () => {
        try {
            const response = await getTimses();
            setTimsesList(response.data);
        } catch (error) {
            console.error('Error fetching Timses:', error);
        }
    }, []);

    const fetchTimsesById = useCallback(async (id) => {
        try {
            const response = await getTimsesId(id);
            setTimsesList(response.data);
        } catch (error) {
            console.error('Error fetching timses by ID:', error);
        }
    }, []);


    const fetchSuara = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const response = await getSuara(searchQuery);
            const userSuara = response.data.filter(suara => suara.user_id === userId);
            setRows(userSuara);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
        setLoading(false);
    }, [userId, searchQuery]);

    
    useEffect(() => {
        fetchSuara(); 
        // eslint-disable-next-line
    }, []);


    // ---- handle toolbar state in the table ----
    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
        setPage(0);

        if (query) {
            const searchLowercased = query.toLowerCase();
            const newFilteredRows = clientFilteredRows.length > 0 ? clientFilteredRows : rows;
            const searchedRows = newFilteredRows.filter((row) => (
                row.nik.toLowerCase().includes(searchLowercased) ||
                row.nama.toLowerCase().includes(searchLowercased) ||
                row.kabupaten.toLowerCase().includes(searchLowercased) ||
                row.kecamatan.toLowerCase().includes(searchLowercased) ||
                row.kelurahan.toLowerCase().includes(searchLowercased) ||
                row.tps.toLowerCase().includes(searchLowercased) ||
                row.status.toLowerCase().includes(searchLowercased)
            ));

            setClientFilteredRows(searchedRows);
        } else {
            setClientFilteredRows(rows);
        }
    }, [setSearchQuery, setPage, clientFilteredRows, rows]);

    // ---- handle filter data in the table ----
    const filteredRows = rows.filter((row) => (
        row.nik.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.kabupaten.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.kecamatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.kelurahan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.tps.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.status.toLowerCase().includes(searchQuery.toLowerCase())
    ));

    const rowsToRender = clientFilteredRows.length > 0 ? clientFilteredRows : filteredRows;

    const sortedAndFilteredRows = applyFilter({
        inputData: rowsToRender,
        comparator: getComparator(order, orderBy),
        filterName
    });

    const handleFilter = useCallback((filterData) => {
        const newFilteredRows = rows.filter(row => {
            return (
                (!filterData.kabupaten || row.kabupaten === filterData.kabupaten) &&
                (!filterData.kecamatan || row.kecamatan === filterData.kecamatan) &&
                (!filterData.kelurahan || row.kelurahan === filterData.kelurahan) &&
                (!filterData.status || row.status === filterData.status)
            );
        });

        const searchLowercased = searchQuery.toLowerCase();
        const searchedAndFilteredRows = newFilteredRows.filter((row) => (
            row.nik.toLowerCase().includes(searchLowercased) ||
            row.nama.toLowerCase().includes(searchLowercased) ||
            row.kabupaten.toLowerCase().includes(searchLowercased) ||
            row.kecamatan.toLowerCase().includes(searchLowercased) ||
            row.kelurahan.toLowerCase().includes(searchLowercased) ||
            row.tps.toLowerCase().includes(searchLowercased) ||
            row.status.toLowerCase().includes(searchLowercased)
        ));

        setClientFilteredRows(searchedAndFilteredRows);
    }, [rows, searchQuery, setClientFilteredRows]);


    const handleFilterByName = useCallback((event) => {
        setPage(0);
        setFilterName(event.target.value);
    }, [setPage, setFilterName]);

    const resetFilters = useCallback(() => {
        setFilterName('');
        setStatusFilter('');
        setSearchQuery('');
        setClientFilteredRows(rows);
    }, [setFilterName, setStatusFilter, setSearchQuery, setClientFilteredRows, rows]);


    const handleEdit = useCallback(async (id) => {
        const dataToEdit = rows.find((row) => row.id === id);
        setDataForEdit(dataToEdit);
        setDialogMode(DIALOG_MODE.EDIT);
    }, [setDataForEdit, setDialogMode, rows, DIALOG_MODE.EDIT]);



    const handleDelete = useCallback(async (id) => {
        try {
            await deleteSuara(id);
            setShowDeleteAlert(true);
            setSelected([]);
            fetchSuara();
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    }, [setShowDeleteAlert, setSelected, fetchSuara]);


    const contextValue = useMemo(() => {
        return {
            rows,
            suaraData,
            loading,
            page,
            order,
            orderBy,
            rowsPerPage,
            selected,
            filterName,
            searchQuery,
            statusFilter,
            showAddAlert,
            showEditAlert,
            showDeleteAlert,
            dataForEdit,
            dialogMode,
            clientFilteredRows,
            filteredRows,
            rowsToRender,
            sortedAndFilteredRows,
            DIALOG_MODE,
            timsesList,
            // Handler functions
            fetchTimses,
            fetchTimsesById,
            fetchSuara,
            handleSearch,
            handleFilter,
            handleFilterByName,
            resetFilters,
            handleEdit,
            handleDelete,
            // State setters
            setRows,
            setPage,
            setOrder,
            setOrderBy,
            setRowsPerPage,
            setSelected,
            setShowAddAlert,
            setShowEditAlert,
            setShowDeleteAlert,
            setDataForEdit,
            setDialogMode,
            setStatusFilter,
            setClientFilteredRows,
        };
    }, [
        // Dependencies that, when changed, will cause the context value to be recalculated
        rows,
        suaraData,
        loading,
        page,
        order,
        orderBy,
        rowsPerPage,
        selected,
        filterName,
        searchQuery,
        statusFilter,
        showAddAlert,
        showEditAlert,
        showDeleteAlert,
        dataForEdit,
        dialogMode,
        clientFilteredRows,
        filteredRows,
        rowsToRender,
        sortedAndFilteredRows,
        DIALOG_MODE,
        timsesList,
        // Handler functions
        fetchTimses,
        fetchTimsesById,
        fetchSuara,
        handleSearch,
        handleFilter,
        handleFilterByName,
        resetFilters,
        handleEdit,
        handleDelete,
        // State setters
        setRows,
        setPage,
        setOrder,
        setOrderBy,
        setRowsPerPage,
        setSelected,
        setShowAddAlert,
        setShowEditAlert,
        setShowDeleteAlert,
        setDataForEdit,
        setDialogMode,
        setStatusFilter,
        setClientFilteredRows,
    ]);

    return (
        <SuaraContext.Provider value={contextValue}>
            {children}
        </SuaraContext.Provider>
    );
};

SuaraProvider.propTypes = {
    children: PropTypes.node.isRequired,
};