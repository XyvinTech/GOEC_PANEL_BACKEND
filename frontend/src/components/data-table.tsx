'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import Image from 'next/image';
// import { Station } from "@/types/table-types";

import data from '@/data/table-data';
import { Switch } from './ui/switch';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  selectStation,
  getAllStations,
  deleteStation,
  Station,
  selectStatus,
  selectPagination,
} from '../lib/features/chargingStations/stationSlice';
import { CityType, StateType } from '@/types/country-types';
import {
  getCitiesNames,
  getStateNames,
} from '@/lib/functions/country-names-api';
import ComboBox from './combobox';

type Items = {
  value: string;
  label: string;
};

type RowSelectionState = Record<string, boolean>;

export default function OrderTable() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const charingStations = useAppSelector(selectStation);
  const pagination = useAppSelector(selectPagination);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  // const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const [states, setStates] = React.useState<Items[]>([]);
  const [cities, setCities] = React.useState<Items[]>([]);

  const [filterData, setFilterData] = React.useState({
    state: '',
    city: '',
    goecOnly: false,
    page: 1,
    pageLimit: 30,
  });

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const selectedRowCount = Object.values(rowSelection).filter(
    (value) => value
  ).length;
  const isSingleRowSelected = selectedRowCount === 1;

  const columns: ColumnDef<Station>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className='flex h-full items-end pb-3'>
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label='Select all'
          />
        </div>
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'stationName',
      header: ({ column }) => {
        return (
          <div className='space-y-2 py-2'>
            <p className='text-black font-bold'>Name</p>
          </div>
        );
      },
    },
    {
      id: 'location',
      accessorFn: (row) =>
        `${row.location.address}, ${row.location.city}, ${row.location.state}`,
      header: ({ column }) => {
        return (
          <div className='space-y-2 py-2'>
            <p className='text-black font-bold'>Location</p>
          </div>
        );
      },
    },

    {
      id: 'vehicles',
      accessorFn: (row) =>
        row.chargers.map((charger) => charger.vehicleType).join(', '),
      header: ({ column }) => {
        return (
          <div className='space-y-2 py-2'>
            <p className='text-black font-bold'>Vehicles</p>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className='lowercase'>{row.getValue('vehicles')}</div>
      ),
    },
    {
      id: 'socket_type',
      accessorFn: (row) =>
        row.chargers.map((charger) => charger.socketType).join(', '),
      header: () => (
        <div className='space-y-2'>
          <p className='text-black font-bold'>Socket Type</p>
        </div>
      ),
      cell: ({ row }) => {
        const socketList = row.original.chargers.map(
          (charger) => charger.socketType
        );
        const uniqueSocketList = Array.from(new Set(socketList));
        return (
          <div className='flex flex-row gap-1 w-40 flex-wrap'>
            {uniqueSocketList?.map((value: string, index: number) => (
              <div
                key={index}
                className='capitalize w-fit bg-[#AEE9D1] h-fit flex items-center gap-1 px-2 py-1 rounded-full'
              >
                <div className='w-[10px] h-[10px] rounded-full bg-[#007F5F]' />
                <p className='text-xs'>{value}</p>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      id: 'amenities',
      accessorFn: (row) => {
        return Object.entries(row.amenities)
          .filter(([_, value]) => value)
          .map(([key, _]) => key)
          .join(', ');
      },
      header: () => (
        <div className='space-y-2'>
          <p className='text-black font-bold'>Amenities</p>
        </div>
      ),
      cell: ({ row }) => {
        const amenitiesList = Object.entries(row.original.amenities)
          .filter(([_, value]) => value)
          .map(([key, _]) => key);

        return (
          <div className='flex flex-row gap-1 w-48 flex-wrap'>
            {amenitiesList.map((value: string, index: number) => (
              <div
                key={index}
                className='capitalize w-fit bg-[#E4E5E7] h-fit flex items-center gap-1 px-2 py-1 rounded-full'
              >
                <p className='text-xs'>{value}</p>
              </div>
            ))}
          </div>
        );
      },
    },
  ];
  const table = useReactTable({
    data: charingStations || [],
    columns,
    getRowId: (row) => row._id as string,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  React.useEffect(() => {
    const getStates = async () => {
      const data: StateType[] = await getStateNames('India');
      const modifiedData = data.map((state) => ({
        value: state.state_name,
        label: state.state_name,
      }));
      setStates(modifiedData);
    };

    getStates();
  }, []);

  React.useEffect(() => {
    const getCities = async () => {
      const data: CityType[] = await getCitiesNames(filterData.state);
      const modifiedData = data.map((city) => ({
        value: city.city_name,
        label: city.city_name,
      }));
      setCities(modifiedData);
      console.log({ modifiedData });
    };
    getCities();
  }, [filterData.state]);

  // React.useEffect(() => {
  //   dispatch(getAllStations(undefined));
  // }, [dispatch]);

  React.useEffect(() => {
    dispatch(getAllStations(filterData));
  }, [filterData]);

  // React.useEffect(() => {
  //   dispatch(getAllStations(undefined));
  // }, [charingStations]);

  const goToPreviousPage = () => {
    setFilterData((prevState) => ({
      ...prevState,
      page: prevState.page - 1,
    }));
  };

  const goToNextPage = () => {
    // setCurrentPage(currentPage + 1);
    setFilterData((prevState) => ({
      ...prevState,
      page: prevState.page + 1,
    }));
  };

  const goToFirstPage = () => {
    setFilterData((prevState) => ({
      ...prevState,
      page: 1,
    }));
  };

  const goToLastPage = () => {
    const lastPage = pagination.totalPages;

    setFilterData((prevState) => ({
      ...prevState,
      page: lastPage,
    }));
  };

  const handleDeleteSelected = async () => {
    const selectedIds = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    dispatch(deleteStation(selectedIds));
    setTimeout(() => {
      dispatch(getAllStations(filterData));
    }, 2000);
  };

  const handleEdit = async () => {
    const selectedIds = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    router.push(`/edit/${selectedIds[0]}`);
  };

  const handleSwitchChange = (newCheckedState: boolean) => {
    setFilterData((prevState) => ({
      ...prevState,
      goecOnly: newCheckedState,
    }));

    // console.log('swithced changes---', isSwitchOn);
  };

  const handleStateChange = (state: string) => {
    setFilterData((prevState) => ({
      ...prevState,
      state: state,
    }));
  };

  const handleCityChange = (city: string) => {
    setFilterData((prevState) => ({
      ...prevState,
      city: city,
    }));
  };

  const handleRowClick = (id: string) => {
    router.push(`/edit/${id}`);
  };
  const handleAddNew = () => {
    router.push(`/add`);
  };

  return (
    <div className='w-full bg-white rounded-md border'>
      <div className='w-full bg-white p-3 border-b rounded-md'>
        <div className=' w-full flex justify-between items-center py-6'>
          <Button
            type='button'
            onClick={handleAddNew}
            className='h-fit flex items-center gap-2 px-0 bg-transparent hover:bg-transparent'
          >
            <Plus color='#13F2AD' size={20} />
            <p className='text-primary text-sm'>Add station</p>
          </Button>

          <div className='flex gap-5'>
            <div className='flex flex-col gap-2'>
              <p className='text-sm font-bold'>By city</p>
              <ComboBox
                disabled={filterData.state === ''}
                placeholder='Choose City'
                value={filterData.city}
                items={cities}
                onChange={(val) => handleCityChange(val)}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <p className='text-sm font-bold'>By state</p>

              <ComboBox
                placeholder='Choose State'
                value={filterData.state}
                items={states}
                onChange={(val) => handleStateChange(val)}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <p className='text-sm font-bold'>By country</p>
              <Input value='India' placeholder='Enter coupon code' />
            </div>
          </div>
        </div>

        <div className='flex h-fit items-center'>
          {isSingleRowSelected && (
            <button
              className='w-fit px-4 py-2 rounded-none rounded-tl-sm rounded-bl-sm bg-transparent hover:bg-[#dadada] border border-[#E1E3E5] text-black font-semibold text-sm'
              onClick={handleEdit}
            >
              Edit
            </button>
          )}
          {selectedRowCount > 0 && (
            <button
              className='w-fit px-4 py-2 bg-transparent hover:bg-[#dadada] border border-[#E1E3E5] rounded-none text-black font-semibold text-sm focus:outline-none focus:ring'
              onClick={handleDeleteSelected}
            >
              Delete
            </button>
          )}
          <div className='w-fit px-4 py-[6px] h-fit flex gap-2 items-center rounded-none rounded-tr-sm rounded-br-sm bg-transparent hover:bg-[#dadada] border border-[#E1E3E5] text-black font-semibold text-sm'>
            Only Goec
            <Switch
              checked={filterData.goecOnly}
              onCheckedChange={handleSwitchChange}
            />
          </div>
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? 'selected' : 'undefined'}
                className='cursor-pointer'
              >
                {row.getVisibleCells().map((cell) => {
                  // Check if the cell is for the stationName column
                  if (cell.column.id === 'stationName') {
                    return (
                      <TableCell
                        key={cell.id}
                        // Add the click event handler specifically to this cell
                        onClick={() =>
                          handleRowClick(row.original._id as string)
                        }
                        className='cursor-pointer'
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  } else {
                    // For all other cells, render them without the click handler
                    return (
                      <TableCell
                        key={cell.id}
                        className='cursor-default' // or any other className for non-clickable cells
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  }
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {pagination.totalPages > 0 && (<TableFooter>
          <TableRow className=''>
            <TableCell colSpan={2} className=''>
              <div className='flex items-center gap-2.5'>
                <p>Show</p>
                <Input className='max-w-[45px]' value={table.getRowCount()} />
                <p className='w-16'>per page</p>
              </div>
            </TableCell>
            <TableCell colSpan={5} className=' items-center justify-end'>
              <div className='flex items-center justify-end gap-2.5'>
                <Input value={pagination.page} className='max-w-[45px]' />
                {pagination.page > 1 && (
                  <Button variant='outline' size='sm' onClick={goToFirstPage}>
                    <Image
                      src='/svg/double-left.svg'
                      alt='left'
                      width={18}
                      height={18}
                    />
                  </Button>
                )}
                {pagination.page > 1 && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={goToPreviousPage}
                  >
                    <Image
                      src='/svg/left-arrow.svg'
                      alt='left'
                      width={18}
                      height={18}
                    />
                  </Button>
                )}
                {pagination.page !== pagination.totalPages && (
                  <Button variant='outline' size='sm' onClick={goToNextPage}>
                    <Image
                      src='/svg/greater.svg'
                      alt='greater'
                      width={18}
                      height={18}
                    />
                  </Button>
                )}

                {pagination.page !== pagination.totalPages && (
                  <Button
                    className='gap-0'
                    variant='outline'
                    size='sm'
                    onClick={goToLastPage}
                  >
                    <Image
                      src='/svg/double-greater.svg'
                      alt='greater'
                      width={20}
                      height={18}
                    />
                  </Button>
                )}

                {/* <p>{table.getRowCount()} records</p> */}
                <p>{pagination.totalPages} pages</p>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>)}
      </Table>
    </div>
  );
}
