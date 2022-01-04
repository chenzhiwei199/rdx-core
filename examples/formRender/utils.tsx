export function isEmpty(children) {
  return !children || children.length === 0 || children.props.dataSource.length === 0
}

