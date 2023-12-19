/**
 * 工作类型
 */
interface PackageType {
  package_code: string
  package_address: string
  consignee: string
  consignee_phone: string
  consignee_address: string
  package_id: number
  status: number
  create_time: Date
  update_time: Date

}
export default PackageType
