import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, IconButton, Menu, SxProps, Theme, Tooltip, Typography } from "@mui/material";
import TreeItem from "@mui/lab/TreeItem";
import {
  MouseEventHandler,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { MenuDrawerContext } from "./T1Drawer";

export interface IT1MenuItemProps {
  children?: ReactNode;
  nodeId: string;
  label: NonNullable<ReactNode>;
  link?: boolean | string;
  /** If true, overflowing label text will be hidden behind ellipsis. */
  textEllipsis?: boolean;
  options?: Options;
  /** Additional menus or popovers for `options` items. */
  optionsExtras?: Options;
  icon?: ReactNode;
  sx?: SxProps<Theme>;
  menuRef?: React.Ref<HTMLUListElement>;
  tooltip?: string;
}

type Options = ReactNode | ((api: OptionsAPI) => ReactNode)

export interface OptionsAPI {
  close(): void;
}

export default function T1MenuItem(props: IT1MenuItemProps) {
  const {
    label,
    link,
    textEllipsis = false,
    options,
    optionsExtras,
    sx,
    menuRef,
    tooltip,
    ...rest
  } = props;

  const [showOptions, setShowOptions] = useState(false);
  const rootRef = useRef<Element>(null);
  const optsBtnRef = useRef<HTMLButtonElement>(null);
  const menuApi = useContext(MenuDrawerContext);

  const handleClickOptions = useCallback<MouseEventHandler>(e => {
    e.preventDefault();
    e.stopPropagation();
    setShowOptions(true);
  }, []);

  const api = useMemo(() => ({
    close: () => {
      setShowOptions(false)
    },
  }), []);

  useEffect(() => {
    menuApi.register({
      nodeId: rest.nodeId,
      link,
    });

    return () => {
      menuApi.unregister(rest.nodeId);
    }
  }, [link]);

  return (
    <TreeItem
      ref={rootRef}
      label={
        <Box
          sx={{
            position: 'relative',
            py: 0.5,
          }}
          className="T1MenuItem-label"
        >
          <Label ellipsis={textEllipsis} tooltip={tooltip}>{label}</Label>
          {options && (
            <Box
              className="T1MenuItem-optionsButton"
              sx={{
                position: 'absolute',
                top: '50%',
                right: 0,
                opacity: 0,
                pr: 1,
                transition: 'opacity .2s ease-out',
                transform: 'translateY(-50%)',
              }}
              onClick={e => {
                e.stopPropagation()
              }}
            >
              <IconButton ref={optsBtnRef} onClick={handleClickOptions}>
                <MoreVertIcon/>
              </IconButton>
              <Menu
                open={showOptions}
                MenuListProps={{
                  ref: menuRef,
                }}
                onClose={() => setShowOptions(false)}
                anchorEl={optsBtnRef.current}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                {typeof options === 'function' ? options(api) : options}
              </Menu>
              {typeof optionsExtras === 'function' ? optionsExtras(api) : optionsExtras}
            </Box>
          )}
        </Box>
      }
      sx={[
        {
          '& > .MuiTreeItem-content:hover .T1MenuItem-optionsButton': {
            opacity: 1,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    />
  )
}

interface ILabelProps {
  children: NonNullable<ReactNode>;
  ellipsis: boolean;
  tooltip?: string | undefined;
}

function Label(props: ILabelProps) {
  const {
    children,
    ellipsis,
    tooltip,
  } = props;

  if (!ellipsis) {
    return (
      <Typography variant="body1">{children}</Typography>
    )
  }
  return (
    <Tooltip title={tooltip === undefined ? children : tooltip} placement="right">
      <Typography
        variant="body1"
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          paddingRight: 5
        }}
      >
        {children}
      </Typography>
    </Tooltip>
  )
}
