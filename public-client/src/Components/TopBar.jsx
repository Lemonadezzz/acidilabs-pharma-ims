import { useSelector, useDispatch } from "react-redux";
import { differenceInDays, format } from "date-fns";
import {
  Avatar,
  Badge,
  Card,
  Drawer,
  message,
  Popconfirm,
  Space,
  Tooltip,
} from "antd";
import {
  UserIcon,
  Bars3CenterLeftIcon,
  XMarkIcon,
  ChevronRightIcon,
  IdentificationIcon,
  HomeIcon,
  ListBulletIcon,
  TruckIcon,
  HashtagIcon,
  ServerStackIcon,
  TagIcon,
  UsersIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  BellIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  toggleDrawer,
  toggleNotificationDrawer,
} from "../app/features/rootSlice";
import { logout } from "../app/features/authSlice";
import { useFetchAuthInfoQuery } from "../app/features/api/authApiSlice";
import { useGetWarningQuery } from "../app/features/api/itemsApiSlice";

// custom close icon for drawer
const CustomCloseIcon = () => (
  <span className="flex justify-between items-center p-2 cursor-pointer hover:bg-primary transition-all duration-150 ease-out hover:text-white rounded-full">
    <XMarkIcon className="w-6 h-6" />
  </span>
);

const TopBar = () => {
  const { data, isLoading, isError } = useFetchAuthInfoQuery();
  const { data: warningItems, isLoading: warningItemsLoading } =
    useGetWarningQuery();
  const auth = useSelector((state) => state.auth);
  const root = useSelector((state) => state.root);

  // local states
  const [visible, setVisible] = useState(false);

  // instances
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // console.log(auth.userData);
  // console.log(warningItems);

  // handling logout if token is invalid
  useEffect(() => {
    if ((!isLoading && isError) || (!isLoading && !data?.success)) {
      message.warning("Please authenticate again!");
      localStorage.removeItem("JB__T__111A");
      localStorage.removeItem("JB__U__111A");
      dispatch(logout());
    }
  }, [isLoading, isError, dispatch, data]);

  return (
    <>
      <section className="absolute top-0 w-full h-14 bg-white flex justify-between items-center px-2 sm:px-4">
        <div className="flex items-center gap-x-3">
          <span
            className="flex justify-between items-center p-2 cursor-pointer hover:bg-primary transition-all duration-150 ease-out hover:text-white rounded-full"
            onClick={() => dispatch(toggleDrawer())}
          >
            <Bars3CenterLeftIcon className="w-7 h-7" />
          </span>
          <span className="md:text-lg lg:text-xl font-bold capitalize">
            {location.pathname === "/"
              ? "Dashboard"
              : location.pathname?.replace("/", "")}
          </span>
        </div>
        <div className="space-x-2 hidden sm:inline-block">
          <span className="font-bold">{format(new Date(), "p")}</span>
          <span>{format(new Date(), "PPPP")}</span>
        </div>
        <div>
          <div className="flex items-center gap-x-3">
            <Badge dot={warningItems?.items?.length !== 0}>
              <BellIcon
                className="w-6 h-6 md:w-6 md:h-6 cursor-pointer"
                onClick={() => dispatch(toggleNotificationDrawer())}
              />
            </Badge>
            <div className="relative">
              {auth.userData.profile_pic_url ? (
                <Avatar
                  src={auth.userData.profile_pic_url}
                  onClick={() => setVisible((prev) => !prev)}
                />
              ) : (
                <Avatar
                  size="large"
                  className="bg-primary flex items-center justify-center cursor-pointer"
                  icon={<UserIcon className="w-6 h-6" />}
                  onClick={() => setVisible((prev) => !prev)}
                />
              )}

              {/* profile popup */}
              {visible && (
                <div className="absolute top-10 bg-white -right-2 md:-right-4 px-3 py-4 md:px-4 z-50">
                  {/* <Tooltip title="Settings" placement="left">
                    <span className="flex justify-between items-center p-2 my-2 cursor-pointer hover:bg-primary transition-all duration-150 ease-out hover:text-white rounded-full">
                      <Cog6ToothIcon className="w-5 h-5 md:w-6 md:h-6" />
                    </span>
                  </Tooltip> */}

                  {/* <Tooltip title="About" placement="left">
                    <span className="flex justify-between items-center p-2 my-2 cursor-pointer hover:bg-primary transition-all duration-150 ease-out hover:text-white rounded-full">
                      <InformationCircleIcon className="w-5 h-5 md:w-6 md:h-6" />
                    </span>
                  </Tooltip> */}

                  <Tooltip title="Logout" placement="left">
                    <Popconfirm
                      title="Are you sure you want to logout?"
                      description="Are you sure you want to logout?"
                      onConfirm={() => {
                        localStorage.removeItem("JB__T__111A");
                        localStorage.removeItem("JB__U__111A");
                        dispatch(logout());
                      }}
                      onCancel={() => { }}
                      placement="left"
                      okText="Yes"
                      cancelText="No"
                    >
                      <span className="flex justify-center items-center p-2 my-2 cursor-pointer hover:bg-primary transition-all duration-150 ease-out hover:text-white rounded-full">
                        <PowerIcon className="w-5 h-5 md:w-6 md:h-6" />
                      </span>
                    </Popconfirm>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Drawer
        title={
          <div className="flex items-center">

            <span className="font-bold text-primary text-xl md:text-1xl">
              AcidiLabs Pharma IMS v1.0
            </span>
          </div>
        }
        open={root.isDrawerOpen}
        closable={true}
        placement="left"
        onClose={() => dispatch(toggleDrawer())}
        closeIcon={<CustomCloseIcon />}
      >
        <div>
          <div
            className={`shadow px-4 py-3 cursor-pointer rounded-m sm:my-6 my-4 flex items-center justify-between hover:bg-primary hover:text-white transition-all duration-150 ease-out ${location.pathname === "/" && "text-white bg-primary"
              }`}
            onClick={() => {
              // dispatch(toggleDrawer());
              navigate("/");
            }}
          >
            <div className="flex items-center justify-center gap-x-3">
              <HomeIcon className="w-6 h-6" />
              <span className="font-bold ">Dashboard</span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-primary" />
          </div>

          {auth.userData.permissions.items.includes("R") && (
            <div
              className={`shadow px-4 py-3 cursor-pointer rounded-m sm:my-6 my-4 flex items-center justify-between hover:bg-primary hover:text-white transition-all duration-150 ease-out ${location.pathname.includes("/items") && "text-white bg-primary"
                }`}
              onClick={() => {
                // dispatch(toggleDrawer());
                navigate("/items");
              }}
            >
              <div className="flex items-center justify-center gap-x-3">
                <ListBulletIcon className="w-6 h-6" />
                <span className="font-bold ">Items</span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-primary" />
            </div>
          )}

          {auth.userData.permissions.orders.includes("R") && (
            <div
              className={`shadow px-4 py-3 cursor-pointer rounded-m sm:my-6 my-4 flex items-center justify-between hover:bg-primary hover:text-white transition-all duration-150 ease-out ${location.pathname === "/orders" && "text-white bg-primary"
                }`}
              onClick={() => {
                navigate("/orders");
                // dispatch(toggleDrawer());
              }}
            >
              <div className="flex items-center justify-center gap-x-3">
                <TagIcon className="w-6 h-6" />
                <span className="font-bold ">Purchase Orders</span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-primary" />
            </div>
          )}

          {auth.userData.permissions.returns.includes("R") && (
            <div
              className={`shadow px-4 py-3 cursor-pointer rounded-m sm:my-6 my-4 flex items-center justify-between hover:bg-primary hover:text-white transition-all duration-150 ease-out ${location.pathname === "/returns" && "text-white bg-primary"
                }`}
              onClick={() => {
                // dispatch(toggleDrawer());
                navigate("/returns");
              }}
            >
              <div className="flex items-center justify-center gap-x-3">
                <TruckIcon className="w-6 h-6" />
                <span className="font-bold ">Purchase Returns</span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-primary" />
            </div>
          )}
          {auth.userData.permissions.suppliers.includes("R") && (
            <div
              className={`shadow px-4 py-3 cursor-pointer rounded-m sm:my-6 my-4 flex items-center justify-between hover:bg-primary hover:text-white transition-all duration-150 ease-out ${location.pathname === "/vendors" && "text-white bg-primary"
                }`}
              onClick={() => {
                // dispatch(toggleDrawer());
                navigate("/vendors");
              }}
            >
              <div className="flex items-center justify-center gap-x-3">
                <IdentificationIcon className="w-6 h-6" />
                <span className="font-bold ">Suppliers</span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-primary" />
            </div>
          )}

          {auth.userData.role === "Admin" && (
            <div
              className={`shadow px-4 py-3 cursor-pointer rounded-m sm:my-6 my-4 flex items-center justify-between hover:bg-primary hover:text-white transition-all duration-150 ease-out ${location.pathname === "/logs" && "text-white bg-primary"
                }`}
              onClick={() => {
                // dispatch(toggleDrawer());
                navigate("/logs");
              }}
            >
              <div className="flex items-center justify-center gap-x-3">
                <HashtagIcon className="w-6 h-6" />
                <span className="font-bold ">History/Logs</span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-primary" />
            </div>
          )}

          {/* {auth.userData.permissions.archives.includes("R") && (
            <div
              className={`shadow px-4 py-3 cursor-pointer rounded-m sm:my-6 my-4 flex items-center justify-between hover:bg-primary hover:text-white transition-all duration-150 ease-out ${location.pathname === "/archives" && "text-white bg-primary"
                }`}
              onClick={() => {
                // dispatch(toggleDrawer());
                navigate("/archives");
              }}
            >
              <div className="flex items-center justify-center gap-x-3">
                <ServerStackIcon className="w-6 h-6" />
                <span className="font-bold ">Archives</span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-primary" />
            </div>
          )} */}

          {auth.userData.role === "Admin" && (
            <div
              className={`shadow px-4 py-3 cursor-pointer rounded-m sm:my-6 my-4 flex items-center justify-between hover:bg-primary hover:text-white transition-all duration-150 ease-out ${location.pathname === "/users" && "text-white bg-primary"
                }`}
              onClick={() => {
                // dispatch(toggleDrawer());
                navigate("/users");
              }}
            >
              <div className="flex items-center justify-center gap-x-3">
                <UsersIcon className="w-6 h-6" />
                <span className="font-bold ">User Management</span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-primary" />
            </div>
          )}
        </div>
      </Drawer>

      {/* notification drawer */}
      <Drawer
        title={
          <span className="font-bold text-primary text-xl md:text-2xl">
            NOTIFICATIONS
          </span>
        }
        open={root.isNotificationDrawerOpen}
        closable={true}
        placement="right"
        onClose={() => dispatch(toggleNotificationDrawer())}
        closeIcon={<CustomCloseIcon />}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {
            // notification list
            warningItems?.items?.map((item) => {
              return (
                <Badge.Ribbon text={item?.warning_type}>
                  <Card
                    title={item?.sku}
                    className="cursor-pointer"
                    size="small"
                    onClick={() => {
                      dispatch(toggleNotificationDrawer());
                      navigate(`/items?sku=${item?.sku}`);
                    }}
                  >
                    {item?.warning_type === "Expiry Warning" ? (
                      <p className="text-lg">
                        <span
                          className="text-primary underline cursor-pointer"
                          onClick={() => {
                            dispatch(toggleNotificationDrawer());
                            navigate(`/items?sku=${item?.sku}`);
                          }}
                        >
                          {item.name}
                        </span>{" "}
                        {differenceInDays(new Date(item?.expiry_date), new Date()) <= 0 ? (
                          "has expired!"
                        ) : (
                          <span>
                            will expire in{" "}
                            <span className="text-primary">
                              {differenceInDays(new Date(item?.expiry_date), new Date())} days
                            </span>
                            !
                          </span>
                        )}
                      </p>
                    ) : (
                      <p className="text-lg">
                        {item.qty > 0 ? (
                          <span>
                            <span className="text-primary">
                              <span
                                className="cursor-pointer"
                                onClick={() => {
                                  dispatch(toggleNotificationDrawer());
                                  navigate(`/items?sku=${item?.sku}`);
                                }}
                              >
                                {item.qty}
                              </span>{" "}
                              {item.name} Left
                            </span>
                          </span>
                        ) : (
                          <span className="text-primary">Out of Stock</span>
                        )}
                      </p>

                    )}
                  </Card>
                </Badge.Ribbon>
              );
            })
          }
        </Space>
      </Drawer>
    </>
  );
};

export default TopBar;
