import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import VideosListHead from '../sections/@dashboard/videos/VideosListHead';
import VideosListToolbar from '../sections/@dashboard/videos/VideosListToolbar';
import { fetchCameras, clearErrors, deleteCamera, createCamera } from '../data/slice/CameraSlice';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'numberOfCameras', label: 'Number of Cameras', alignRight: false },
  { id: '' },
];

export default function CameraPage() {
  const [open, setOpen] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cameras, loading, error } = useSelector((state) => state.camera);



  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchCameras()).unwrap();
      } catch (err) {
        console.error("Failed to fetch cameras: ", err);
      }
    };

    fetchData();


  
      

    return () => {
      // Clear errors when component unmounts
      dispatch(clearErrors());
    };
  }, [dispatch]);

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const filteredCameras = filter(cameras, (camera) =>
    camera.name?.toLowerCase().includes(filterName.toLowerCase()),
  ).sort((a, b) => (order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteCamera = async (id) => {
    try {
      await dispatch(deleteCamera(id));
    } catch (error) {
      console.error('Error deleting camera:', error);
    } finally {
      setOpen(null); // Close the Popover after deletion
    }
  };

  const editCamera = (id) => {
    navigate(`/dashboard/edit/${id}`);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, cameras.length - page * rowsPerPage);

  const handleOpenMenu = (event, cameraId) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => (prev === cameraId ? null : cameraId));
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setAnchorEl(null);
  };

  return (
    <>
      <Helmet>
        <title>Cameras</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Cameras
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} href={'/dashboard/room/new'} >
            New Camera
          </Button>
        </Stack>

        <Card>
          <VideosListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <VideosListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={cameras.length}
                  numSelected={selected.length}
                  onRequestSort={() => {}} // Handle sort if needed
                  onSelectAllClick={() => {}} // Handle select all if needed
                />
                <TableBody>
                  {filteredCameras.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((camera) => (
                    <TableRow hover key={camera.id} tabIndex={-1} role="checkbox">
                      <TableCell padding="checkbox">
                        <Checkbox checked={selected.indexOf(camera.name) !== -1} onChange={() => {}} />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          
                          <Typography variant="subtitle2" noWrap>
                            {camera.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{camera.description}</TableCell>
                      <TableCell align="left">{camera.numberOfCameras}</TableCell>
                      <TableCell align="right">
                        <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, camera.id)}>
                          <Iconify icon={'eva:more-vertical-fill'} />
                        </IconButton>
                        <Popover
                          open={open === camera.id}
                          anchorEl={anchorEl}
                          onClose={handleCloseMenu}
                          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                          <Stack direction="row" spacing={2} p={2}>
                            <MenuItem onClick={() => editCamera(camera.id)}>Edit</MenuItem>
                            <MenuItem onClick={() => handleDeleteCamera(camera.id)}>Delete</MenuItem>
                          </Stack>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  ))}

                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={cameras.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
