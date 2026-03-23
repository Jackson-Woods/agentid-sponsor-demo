import { useState } from 'react';
import {
  makeStyles,
  tokens,
  Input,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  SplitButton,
} from '@fluentui/react-components';
import {
  AddRegular,
  DeleteRegular,
  SearchRegular,
  ChevronDownRegular,
} from '@fluentui/react-icons';
import type { OwnerSponsorEntry } from '../../models/types';

const useStyles = makeStyles({
  bar: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 0',
    flexWrap: 'wrap',
  },
  searchBox: {
    width: '250px',
    marginLeft: 'auto',
  },
});

interface CommandBarProps {
  selectedItems: OwnerSponsorEntry[];
  disabled: boolean;
  onAddOwner: () => void;
  onAddSponsor: () => void;
  onRemove: () => void;
  onSearch: (term: string) => void;
  onRefresh: () => void;
}

export function OwnersAndSponsorsCommandBar({
  selectedItems,
  disabled,
  onAddOwner,
  onAddSponsor,
  onRemove,
  onSearch,
  onRefresh,
}: CommandBarProps) {
  const styles = useStyles();
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearch(value);
  };

  return (
    <div className={styles.bar}>
      <Toolbar>
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <ToolbarButton
              icon={<AddRegular style={{ color: tokens.colorBrandForeground1 }} />}
              disabled={disabled}
            >
              Add <ChevronDownRegular fontSize={12} />
            </ToolbarButton>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem onClick={onAddOwner}>
                <b>Add owner</b>
                <br />
                <span style={{ fontSize: '12px', color: tokens.colorNeutralForeground3 }}>
                  Add an owner to grant the ability to manage this agent identity
                </span>
              </MenuItem>
              <MenuItem onClick={onAddSponsor}>
                <b>Add sponsor</b>
                <br />
                <span style={{ fontSize: '12px', color: tokens.colorNeutralForeground3 }}>
                  Add a sponsor to assign a responsible party for this agent identity and to allow that user or group to manage lifecycle workflows and access
                </span>
              </MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
        <ToolbarDivider />
        <ToolbarButton
          icon={<DeleteRegular />}
          onClick={onRemove}
          disabled={disabled || selectedItems.length === 0}
        >
          Remove ({selectedItems.length})
        </ToolbarButton>
      </Toolbar>

      <Input
        className={styles.searchBox}
        contentBefore={<SearchRegular />}
        placeholder="Search owners and sponsors..."
        value={searchValue}
        onChange={(_, d) => handleSearchChange(d.value)}
        disabled={disabled}
      />
    </div>
  );
}
