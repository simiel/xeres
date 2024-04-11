import { StyleSheet, Text, View } from 'react-native';
import * as DM from 'zeego/dropdown-menu';
import RoundBtn from './RoundBtn';

const Dropdown = () => {
  return (
    <DM.Root>
      <DM.Trigger>
        <RoundBtn title='More' icon='ellipsis-horizontal' />
      </DM.Trigger>
      <DM.Content>
        <DM.Item key='statement'>
          <DM.ItemTitle>Statement</DM.ItemTitle>
          <DM.ItemIcon
            ios={{
              name: 'list.bullet.rectangle.fill',
              pointSize: 24,
            }}
          />
        </DM.Item>
        <DM.Item key='converter'>
          <DM.ItemTitle>Converter</DM.ItemTitle>
          <DM.ItemIcon
            ios={{
              name: 'coloncurrencysign.arrow.circlepath',
              pointSize: 24,
            }}
          />
        </DM.Item>
        <DM.Item key='background'>
          <DM.ItemTitle>Background</DM.ItemTitle>
          <DM.ItemIcon
            ios={{
              name: 'photo.fill',
              pointSize: 24,
            }}
          />
        </DM.Item>
        <DM.Item key='add'>
          <DM.ItemTitle>Add new account</DM.ItemTitle>
          <DM.ItemIcon
            ios={{
              name: 'plus.rectangle.fill.on.folder.fill',
              pointSize: 24,
            }}
          />
        </DM.Item>
      </DM.Content>
    </DM.Root>
  );
};

export default Dropdown;

const styles = StyleSheet.create({});
