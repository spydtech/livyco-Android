import {API_BASE_URL} from '../config/BaseUrl';
import {getUserToken} from '../utils/Api';

const ACTIVE_BOOKING_STATUSES = ['approved', 'active', 'confirmed', 'pending'];

const mapBookingToStay = booking => {
  const property = booking?.property || booking?.propertyId || {};
  const roomDetails = booking?.roomDetails?.[0] || {};
  const status = (booking?.bookingStatus || '').toLowerCase();
  const isActive = ACTIVE_BOOKING_STATUSES.includes(status) && !booking?.moveOutDate;

  const addressParts = [property?.locality, property?.city]
    .filter(part => !!part)
    .join(', ');

  const rawImage = Array.isArray(property?.images) ? property.images[0] : null;
  const image =
    typeof rawImage === 'string'
      ? rawImage
      : rawImage?.url || rawImage?.secure_url || null;

  return {
    _id: booking?._id || booking?.id,
    title: property?.name || 'N/A',
    address: addressParts || 'N/A',
    checkIn: booking?.moveInDate || null,
    checkOut: booking?.moveOutDate || null,
    floor: roomDetails?.floor || booking?.floor || null,
    room: roomDetails?.roomNumber || booking?.roomNumber || null,
    sharing: booking?.roomType || roomDetails?.roomType || null,
    image: image,
    bookingStatus: booking?.bookingStatus || 'pending',
    isPresent: isActive,
    raw: booking,
  };
};

/**
 * Get user's stays/bookings using /api/bookings/user endpoint
 * @returns {Promise<Object>} Normalized stay list
 */
export const getMyStays = async () => {
  try {
    const token = await getUserToken();
    if (!token) {
      return {
        success: false,
        data: [],
        message: 'User not authenticated',
      };
    }

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${API_BASE_URL}bookings/user`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    const bookings = data?.bookings || data?.data || [];
    const normalized = bookings.map(mapBookingToStay);

    return {
      success: response.ok && (data?.success ?? true),
      data: normalized,
      message: data?.message || '',
    };
  } catch (error) {
    console.error('Get my stays error:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to fetch stays',
    };
  }
};

