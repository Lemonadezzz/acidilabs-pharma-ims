import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";
import {
  Button,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Spin,
  Table,
} from "antd";
import {
  useAddCategoryMutation,
  useArchiveItemMutation,
  useDeleteItemMutation,
  useGetCategoriesQuery,
  useGetItemsQuery,
  useItemUseMutation,
  useSearchItemsQuery,
  useUpdateItemMutation,
} from "../app/features/api/itemsApiSlice";
import ItemsHeader from "../Components/Items/ItemsHeader";
import { QrReader } from "react-qr-reader";
import { useSelector } from "react-redux";

const Items = () => {
  const auth = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();

  // local states
  const [page, setPage] = useState(1);
  const [sortby, setSortby] = useState("createdAt");
  const [sortorder, setSortorder] = useState("desc");
  const [searchText, setSearchText] = useState(searchParams.get("sku"));
  const [isSearchQrModalVisible, setIsSearchQrModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isUseModalVisible, setIsUseModalVisible] = useState(false);
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
  const [archiveItem, archiveResult] = useArchiveItemMutation();
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

  const handleArchive = (id) => {
    archiveItem({ id, isArchived: true }).then((res) => {
      if (res.data?.success) {
        message.success("Item archived successfully!");
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
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      responsive: ["md"],
    },
    {
      title: "Expiry",
      dataIndex: "expiry_date",
      key: "expiry_date",
      render: (date) => <p>{format(new Date(date), "dd-MM-yyyy")}</p>,
      responsive: ["md"],
    },
    {
      title: "Shelf",
      dataIndex: "shelf",
      key: "shelf",
    },
    {
      title: "Action",
      key: "action",
      render: (_, item) => (
        <div>
          <Button
            type="primary"
            onClick={() => {
              setUseSelecedItem(item);
              setIsUseModalVisible(true);
            }}
          >
            Use
          </Button>

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
            Edit
          </Button>
          <Popconfirm
            placement="bottomRight"
            title={"Are you sure to archive this record?"}
            onConfirm={() => handleArchive(item._id)}
            okText="Yes"
            cancelText="No"
            className="hidden md:inline-block"
          >
            <Button
              danger
              className="ml-2"
              loading={archiveResult.isLoading}
              disabled={
                !(
                  auth.permissions.items.includes("W") ||
                  auth.permissions.items.includes("D")
                )
              }
            >
              Archive
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <main className="mt-14 p-2 md:p-4 max-w-[1800px] mx-auto">
      <ItemsHeader
        searchText={searchText}
        setSearchText={setSearchText}
        setIsSearchQrModalVisible={setIsSearchQrModalVisible}
        setSortby={setSortby}
        setSortorder={setSortorder}
      />
      {(isLoading || isSearchDataLoading) && (
        <div className="mt-8 mx-auto flex justify-center items-center min-h-[500px]">
          <Spin size="large" />
        </div>
      )}
      {!isLoading && !isSearchDataLoading && !searchText && (
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={data.items}
          className="mt-4 md:mt-8"
          pagination={false}
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
          pagination={false}
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
          className="my-2"
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex my-2">
          <Input
            placeholder="Enter Quantity"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            type="number"
          />
          <Input
            placeholder="Enter Shelf"
            value={shelf}
            onChange={(e) => setShelf(e.target.value)}
            className="ml-2"
          />
        </div>

        <Input
          placeholder="Enter expiry date (MM-DD-YYYY)"
          className="my-2"
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />

        <div className="flex my-3 justify-around gap-x-2">
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
        </Select>

        <Input
          placeholder="Minimum stock before warning"
          type="number"
          className="mt-2 mb-4"
          value={stockWarningQuantity}
          onChange={(e) => setStockWarningQuantity(e.target.value)}
        />
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

      {/* search qr modal */}
      <Modal
        title="QR Scanner"
        open={isSearchQrModalVisible}
        onCancel={() => {
          setIsSearchQrModalVisible((prev) => !prev);
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setIsSearchQrModalVisible((prev) => !prev);
            }}
          >
            Cancel
          </Button>,
        ]}
      >
        <QrReader
          scanDelay={1000}
          onResult={(result, error) => {
            if (!!result) {
              console.log(result?.text);
              setSearchText(result?.text);
              setIsSearchQrModalVisible((prev) => !prev);
              message.success("QR code scanned successfully!");
            }
          }}
          constraints={{
            facingMode: "environment",
          }}
          onError={(error) => {
            console.info(error);
            setIsSearchQrModalVisible((prev) => !prev);
            message.error("QR code scanning failed! Please try again.");
          }}
          style={{ width: "100%" }}
        />
      </Modal>
    </main>
  );
};

export default Items;
