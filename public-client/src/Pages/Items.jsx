import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { ShoppingCartIcon, CubeAddIcon, EyeOpenIcon, EditIcon, Tooltip, Button, Spinner } from "evergreen-ui"
import {
  Input,
  message,
  Modal,
  Spin,
  Table,
  Divider
} from "antd";
import {
  useAddCategoryMutation,
  useDeleteItemMutation,
  useGetCategoriesQuery,
  useGetItemsQuery,
  useItemUseMutation,
  useSearchItemsQuery,
  useUpdateItemMutation,
} from "../app/features/api/itemsApiSlice";
import ItemsHeader from "../Components/Items/ItemsHeader";

import { useSelector } from "react-redux";

const Items = () => {
  const auth = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  console.log("hello");
  // local states
  const [page, setPage] = useState(1);
  const [sortby, setSortby] = useState("createdAt");
  const [sortorder, setSortorder] = useState("desc");
  const [searchText, setSearchText] = useState(searchParams.get("sku"));
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isUseModalVisible, setIsUseModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [editSelecedItemId, setEditSelecedItemId] = useState(null);
  const [editSelecedItem, setEditSelecedItem] = useState(null);
  const [useSelecedItem, setUseSelecedItem] = useState(null);
  const [usedAmount, setUsedAmount] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  // update item states
  const [name, setName] = useState("");
  const [qty, setQty] = useState(null);
  const [sku, setSku] = useState("");
  const [shelf, setShelf] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [stockWarningQuantity, setStockWarningQuantity] = useState(null);
  const [expiryDate, setExpiryDate] = useState("");
  const [batchNumber, setBatchNumber] = useState("");

  const { isLoading, data } = useGetItemsQuery({
    page,
    sortby,
    sortorder,
  });
  const { data: searchData, isLoading: isSearchDataLoading } =
    useSearchItemsQuery(searchText, {
      skip: !searchText,
    });
  const { data: categoriesData } = useGetCategoriesQuery();
  const [deleteItem] = useDeleteItemMutation();
  // const [archiveItem, archiveResult] = useArchiveItemMutation();
  const [itemUse, useResult] = useItemUseMutation();
  const [updateItem, updateResult] = useUpdateItemMutation();
  const [addCategory, addCategoryResult] = useAddCategoryMutation();

  // handling sku search
  useEffect(() => {
    if (searchParams.get("sku")) {
      setSearchText(searchParams.get("sku"));
    }
  }, [searchParams]);

  if (!auth.permissions.items.includes("R"))
    return (
      <h1 className="text-center mt-24 text-red-300 uppercase">
        You are not authorized to view this page
      </h1>
    );

  // handles
  const handleDelete = (id) => {
    deleteItem({ id }).then((res) => {
      if (res.data?.success) {
        message.success("Item deleted successfully!");
      } else {
        message.error("Something went wrong!");
      }
    });
  };


  const handleUseItem = () => {
    if (!usedAmount) return message.error("Please enter quantity to use");
    if (usedAmount > useSelecedItem?.qty)
      return message.error("Quantity is more than available quantity");

    itemUse({
      id: useSelecedItem._id,
      usedAmount: Number(usedAmount),
    }).then((res) => {
      if (res.data?.success) {
        message.success("Item used successfully!");
        setIsUseModalVisible(false);
        setUsedAmount("");
      } else {
        message.error("Something went wrong!");
      }
    });
  };

  const handleViewDetails = (item) => {
    // Perform any logic to fetch additional details if needed
    setSelectedItemDetails(item);
    setIsDetailsModalVisible(true);
  };


  const handleUpdateItem = () => {
    if (!editSelecedItemId) return message.error("Please try again!");
    if (
      !name &&
      !qty &&
      !sku &&
      !shelf &&
      !status &&
      !category &&
      !stockWarningQuantity &&
      !expiryDate
    )
      return message.error("Please enter at least one field to update");

    let data = {};

    if (name) data.name = name;
    if (qty) data.qty = qty;
    if (sku) data.sku = sku;
    if (shelf) data.shelf = shelf;
    if (status) data.status = status;
    if (category) data.category = category;
    if (stockWarningQuantity) data.low_stock_warning_qty = stockWarningQuantity;
    if (expiryDate) data.expiry_date = expiryDate;

    updateItem({ id: editSelecedItemId, data }).then((res) => {
      if (res.data?.success) {
        message.success("Item updated successfully!");
        setIsUpdateModalVisible(false);
      } else {
        message.error("Something went wrong!");
      }
    });
  };

  // columns for table
  const columns = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => <p className="font-bold">{text}</p>,
      responsive: ["md"],
    },
    {
      title: "Sku",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "qty",
      key: "qty",
    },
    {
      title: "UoM"
    },
    {
      title: "Batch No."
    },
    {
      title: "Expiry Date",
      dataIndex: "expiry_date",
      key: "expiry_date",
      render: (date) => <p>{format(new Date(date), "dd-MM-yyyy")}</p>,
      responsive: ["md"],
    },
    {
      title: "Price"
    },
    {
      title: "Actions",
      key: "action",
      render: (_, item) => (
        <div>

          <Tooltip content="Record Sale" >
            <Button className="hidden md:inline-block">
              <ShoppingCartIcon size={20} style={{ display: 'flex' }} />
            </Button>
          </Tooltip>

          <Tooltip content="Restock" >
            <Button
              className="ml-2 hidden md:inline-block"
              onClick={() => {

              }}
            >
              <CubeAddIcon size={20} style={{ display: 'flex' }} />
            </Button>
          </Tooltip>

          <Tooltip content="Edit Item" >
            <Button
              className="ml-2 hidden md:inline-block"
              onClick={() => {
                setEditSelecedItemId(item._id);
                setName(item.name);
                setQty(item.qty);
                setSku(item.sku);
                setShelf(item.shelf);
                setStatus(item.status);
                setCategory(item.category);
                setStockWarningQuantity(item.low_stock_warning_qty);
                // date would be in string format ("yyyy-MM-dd")
                setExpiryDate(
                  item.expiry_date
                    ? format(new Date(item.expiry_date), "yyyy-MM-dd")
                    : ""
                );
                setIsUpdateModalVisible(true);
              }}
              disabled={
                !(
                  auth.permissions.items.includes("W") ||
                  auth.permissions.items.includes("D")
                )
              }
            >
              <EditIcon size={20} style={{ display: 'flex' }} />

            </Button>
          </Tooltip>

          <Tooltip content="View Details">
            <Button
              className="ml-2 hidden md:inline-block"
              onClick={() => handleViewDetails(item)}
            >
              <EyeOpenIcon size={20} style={{ display: 'flex' }}  />
            </Button>
          </Tooltip>

        </div>
      ),
    },
  ];

  return (
    <main className="mt-14 p-2 md:p-4 max-w-[1800px] mx-auto">
      <ItemsHeader
        searchText={searchText}
        setSearchText={setSearchText}
        setSortby={setSortby}
        setSortorder={setSortorder}
      />
      {(isLoading || isSearchDataLoading) && (
        <div className="mt-8 mx-auto flex justify-center items-center min-h-[500px]">
          <Spinner size="large" />
        </div>
      )}
      {!isLoading && !isSearchDataLoading && !searchText && (
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={data.items}
          className="mt-4 md:mt-8"
          pagination={true}
          key={(item) => item._id}
        />
      )}

      {/* search result table */}
      {!isLoading && searchText && !isSearchDataLoading && (
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={searchData.items}
          className="mt-4 md:mt-8"
          pagination={true}
          key={(item) => item._id}
        />
      )}

      {/* update modal */}
      <Modal
        title="Edit Item"
        open={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible((prev) => !prev)}
        footer={[
          <Button
            key="back"
            onClick={() => setIsUpdateModalVisible((prev) => !prev)}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            style={{ backgroundColor: "#22c55e" }}
            loading={updateResult.isLoading}
            onClick={handleUpdateItem}
          >
            Update
          </Button>,
        ]}
      >
        <Input
          placeholder="Enter SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />
        <Input
          placeholder="Enter Name"
          value={name}
          className="my-1"
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="Enter Batch No."
          className="my-1"
          value={batchNumber}
          onChange={(e) => setBatchNumber(e.target.value)}
        />

        <div className="flex my-1">
          <Input
            placeholder="Enter Quantity"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            type="number"
          />
          <Input
            placeholder="Enter UoM"
            className="ml-1"
          />
        </div>

        <div className="flex my-1">

          <Input
            placeholder="Enter Price"
            className="mt-1 mb-1 mr-1"
          />

          <Input
            placeholder="Enter expiry date (MM-DD-YYYY)"
            className="mt-1 mb-1"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />

        </div>

        <div className="flex my-1 justify-around gap-x-1">
          <Input
            placeholder="Enter Minimum Inventory Level"
            type="number"
            className="mt-1 mb-1"
            value={stockWarningQuantity}
            onChange={(e) => setStockWarningQuantity(e.target.value)}
          />

          <Input
            placeholder="Status"
            className="mt-1 mb-1"
          />
          {/* dropdown? */}

        </div>

        <Divider style={{ borderColor: '#52bd94' }} />

        <span style={{ fontWeight: 'bold' }}>Additional Details</span>

        <Input
          placeholder="Enter Supplier"
          className="my-1"
        />

        <Input
          placeholder="Enter Manufacturer"
          className="my-1"
        />

        <div className="flex my-1 justify-around gap-x-1">
          <Input
            placeholder="Enter Dosage Form"
            className="mt-1 mb-1"
          />

          <Input
            placeholder="Prescription Required?"
            className="mt-1 mb-1"
          />
        </div>

        <div className="flex my-1 justify-around gap-x-1">
          <Input
            placeholder="Enter Strength"
            className="mt-1 mb-1"
          />

          <Input
            placeholder="Enter Active Ingredient"
            className="mt-1 mb-1"
          />
        </div>

        <Input.TextArea
          placeholder="Enter Storage Conditions"
          rows={2}
          className="my-1"
        />


        {/* <div className="flex my-3 justify-around gap-x-2">
          <Select
            placeholder="Select Category"
            onChange={(e) => setCategory(e)}
            options={
              categoriesData?.categories?.map((category) => {
                return { value: category.name, label: category.name };
              }) || []
            }
          />
          <Input
            placeholder="Enter a new category"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <Button
            loading={addCategoryResult.isLoading}
            onClick={() => {
              addCategory({ name: newCategoryName }).then((res) => {
                if (res.data.success) {
                  message.success("Category added successfully");
                } else {
                  message.error("Something went wrong");
                }
              });
              setNewCategoryName("");
            }}
          >
            Add
          </Button>
        </div>
        <Select
          placeholder="Select Status"
          onChange={(e) => setStatus(e)}
          className="my-2"
        >
          <Select.Option value="on stock">On stock</Select.Option>
          <Select.Option value="low on stock">Low on stock</Select.Option>
          <Select.Option value="out of stock">Out of stock</Select.Option>
        </Select> */}


      </Modal>
      <Modal
        title="Item Details"
        visible={isDetailsModalVisible}
        onCancel={() => setIsDetailsModalVisible(false)}
        footer={[
          <Button
            key="back"
            onClick={() => setIsDetailsModalVisible(false)}
          >
            Close
          </Button>,
        ]}
      >
        {selectedItemDetails && (
          <div>
            {/* Display all the item details here */}
            <p>Status: {selectedItemDetails.status}</p>
            <p>SKU: {selectedItemDetails.sku}</p>
            <p>Name: {selectedItemDetails.name}</p>
            <p>Quantity: {selectedItemDetails.qty}</p>
            <p>Date: {selectedItemDetails.expiry_date}</p>
            {/* Add more details as needed */}
          </div>
        )}
      </Modal>


      {/* use modal */}
      <Modal
        title="Use Item"
        open={isUseModalVisible}
        onCancel={() => setIsUseModalVisible((prev) => !prev)}
        footer={[
          <Button
            key="back"
            onClick={() => setIsUseModalVisible((prev) => !prev)}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={useResult.isLoading}
            onClick={handleUseItem}
          >
            Use
          </Button>,
        ]}
      >
        <h3 className="font-normal text-lg mt-3">
          How much{" "}
          <span className="font-bold underline">{useSelecedItem?.name}</span>{" "}
          you want to use?
        </h3>
        <p className=" mt-3 text-lg">
          Available Quantity:{" "}
          <span className="text-primary">{useSelecedItem?.qty}</span>
        </p>
        <Input
          placeholder="Enter quantity"
          className="mt-3 mb-6"
          type="number"
          value={usedAmount}
          onChange={(e) => setUsedAmount(e.target.value)}
        />
      </Modal>

    </main>
  );
};

export default Items;
