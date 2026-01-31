import { MemberStatus, MemberType } from "../enums/member.enum";

export interface MemberCoupon {
  code: string | null;
  discount: number;
  isUsed: boolean;
  expiresAt?: Date | null;
}

export interface CouponValidationResult {
  valid: boolean;
  message?: string;
  discount?: number;
  memberCoupon?: MemberCoupon;
}

export interface AuthData {
  member: Member;
  accessToken: string;
}

export interface Member {
  _id: string;
  memberType: MemberType;
  memberStatus: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberPassword: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImg?: string;
  memberPoints: number;
  memberCoupon?: MemberCoupon;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberInput {
  memberType?: MemberType;
  memberStatus?: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberPassword: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImg?: string;
  memberPoints?: number;
}

export interface LoginInput {
  memberNick: string;
  memberPassword: string;
}

export interface MemberUpdateInput {
  memberNick?: string;
  memberPhone?: string;
  memberPassword?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImg?: string;
}
