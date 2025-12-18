import { StyleSheet } from 'react-native';
import Colors from './Colors';
import LayoutStyle from './LayoutStyle';
import { deviceWidth } from '../utils/DeviceInfo';
import FontFamily from '../assets/FontFamily';

const HelpStyle = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: Colors.goastWhite,
  },
  headerContainerBlue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.secondary,
    ...LayoutStyle.paddingHorizontal20,
    ...LayoutStyle.paddingVertical15,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FontFamily.RobotoBold,
    color: Colors.white,
    flex: 1,
    textAlign: 'center',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 15,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.red,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  contentContainer: {
    flex: 1,
    ...LayoutStyle.paddingHorizontal20,
    ...LayoutStyle.paddingTop20,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: (deviceWidth - 60) / 2, // 2 columns with margins
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  optionImage: {
    width: '100%',
    height: '100%',
  },
  optionText: {
    fontSize: 16,
    fontFamily: FontFamily.RobotoMedium,
    color: Colors.blackText,
    textAlign: 'center',
  },
  // Ticket Screen Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: FontFamily.RobotoMedium,
    color: Colors.blackText,
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.grayText,
    marginTop: 10,
    textAlign: 'center',
  },
  ticketListContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  ticketCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ticketId: {
    fontSize: 16,
    fontFamily: FontFamily.RobotoBold,
    color: Colors.blackText,
    marginBottom: 4,
  },
  ticketDate: {
    fontSize: 12,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.grayText,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: FontFamily.RobotoMedium,
  },
  ticketBody: {
    marginTop: 8,
  },
  ticketCategory: {
    fontSize: 14,
    fontFamily: FontFamily.RobotoMedium,
    color: Colors.secondary,
    marginBottom: 8,
  },
  ticketDescription: {
    fontSize: 13,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.grayText,
    lineHeight: 20,
  },
  // FAB Button
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.modalTransparent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    width: '90%',
    maxHeight: '85%',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    // maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.modalBlue,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FontFamily.RobotoBold,
    color: Colors.white,
    flex: 1,
  },
  modalBody: {
    maxHeight: 400,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: FontFamily.RobotoMedium,
    color: Colors.blackText,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.grayBorder,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.blackText,
    backgroundColor: Colors.white,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.grayBorder,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.blackText,
    backgroundColor: Colors.white,
    minHeight: 100,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.grayBorder,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: Colors.white,
  },
  dropdownPlaceholder: {
    fontSize: 14,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.placeholder,
  },
  dropdownSelectedText: {
    fontSize: 14,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.blackText,
  },
  errorText: {
    fontSize: 12,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.danger,
    marginTop: 5,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.grayBorder,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.grayBorder,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: FontFamily.RobotoMedium,
    color: Colors.blackText,
  },
  createButton: {
    flex: 1,
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 14,
    fontFamily: FontFamily.RobotoMedium,
    color: Colors.white,
  },
});

export default HelpStyle;

